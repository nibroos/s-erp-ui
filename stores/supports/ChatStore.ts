import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta } from '~/interfaces/LaravelPaginationInterface'
import type { AuthUserType } from '~/types/AuthType'
import type {
  AttachmentType,
  ChatUserType,
  ConversationType,
  MemberType,
  MessageType,
  ProfileType,
  ReactionGroupType,
  ThreadType,
  WSEnvelope
} from '~/types/ChatType'

// Module-scoped websocket kept OUT of reactive state (a WebSocket instance is
// not serializable and must not be proxied by Pinia/Vue reactivity).
let socket: WebSocket | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let manuallyClosed = false
// Typing throttle + auto-expiry timers (kept out of reactive state).
let lastTypingSent = 0
const typingTimers: Record<string, ReturnType<typeof setTimeout>> = {}

// Voice recording (kept out of reactive state — MediaRecorder isn't serializable).
let mediaRecorder: MediaRecorder | null = null
let mediaStream: MediaStream | null = null
let recordChunks: Blob[] = []
let recordTimer: ReturnType<typeof setInterval> | null = null
let cancelRecordingFlag = false

// Parse a Postgres "2026-07-14 01:14:57.61+00" timestamp to epoch ms.
// The "+00" offset (2 digits, no colon) isn't valid ISO-8601, so normalise it
// to "+00:00" (and space -> "T") before Date.parse, which otherwise returns NaN.
const parseTs = (s?: string | null): number => {
  if (!s) return 0
  const t = s.trim().replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00')
  const d = Date.parse(t)
  return isNaN(d) ? 0 : d
}

// A read entry: how far a user has read + when.
type ReadEntry = { id: number; at: string }

const currentToken = (): string | null => {
  if (process.server) return null
  const authStore = JSON.parse(
    localStorage.getItem('AuthStore') || '{}'
  ) as { authUser?: AuthUserType }
  return authStore?.authUser?.optional?.token || null
}

const currentUserId = (): number | null => {
  if (process.server) return null
  const authStore = JSON.parse(
    localStorage.getItem('AuthStore') || '{}'
  ) as { authUser?: AuthUserType }
  return (authStore?.authUser?.data?.id as number) || null
}

const buildWsUrl = (token: string): string => {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.API || '') // e.g. http://localhost:4001/api
  const wsBase = apiBase.replace(/^http/, 'ws') // -> ws://... / wss://...
  return `${wsBase}/v1/chats/ws?token=${encodeURIComponent(token)}`
}

const useChatStore = defineStore('ChatStore', {
  state: () => ({
    meId: null as number | null,
    connected: false,

    // user_id -> online? Kept live via websocket presence events.
    onlineUsers: {} as Record<number, boolean>,

    conversations: {
      data: [] as ConversationType[],
      meta: {} as Meta,
      loading: false
    },
    globalSearch: '',

    activeConversationId: null as number | null,
    // Snapshot of the open conversation, kept independent of the (searchable)
    // list so filtering the list never blanks the open thread's header.
    activeConversationInfo: null as ConversationType | null,
    messages: {
      data: [] as MessageType[],
      loading: false,
      hasMore: true
    },
    sending: false,

    // user picker (start a new chat)
    userPicker: {
      open: false,
      search: '',
      data: [] as ChatUserType[],
      loading: false
    },

    // group creation
    groupPicker: {
      open: false,
      title: '',
      search: '',
      data: [] as ChatUserType[],
      selected: [] as number[],
      loading: false,
      creating: false
    },

    // members panel for the active group
    membersPanel: {
      open: false,
      data: [] as MemberType[],
      loading: false
    },
    // add-member sub-picker
    addMemberPicker: {
      open: false,
      search: '',
      data: [] as ChatUserType[],
      loading: false
    },

    // contact / member profile card
    profilePanel: {
      open: false,
      loading: false,
      data: null as ProfileType | null
    },

    // conversation_id -> [user_ids currently typing]
    typingUsers: {} as Record<number, number[]>,

    // conversation_id -> { user_id -> { id, at } } for read receipts
    readState: {} as Record<number, Record<number, ReadEntry>>,

    // composer: reply target + selected @mention user ids for the current draft
    replyTo: null as MessageType | null,
    mentionIds: [] as number[],

    // attachments staged for the next message + upload/record state
    stagedAttachments: [] as AttachmentType[],
    // in-flight uploads with per-file progress
    uploadingItems: [] as { id: string; name: string; percent: number }[],
    recording: { active: false, seconds: 0 },

    // inline edit state
    editing: { id: null as number | null, content: '' },

    // Threads & group info panel
    threadsPanel: {
      open: false,
      tab: 'threads' as 'threads' | 'info',
      data: [] as ThreadType[],
      loading: false
    }
  }),

  getters: {
    unreadTotal(state): number {
      return state.conversations.data.reduce(
        (sum, c) => sum + (c.unread_count || 0),
        0
      )
    },
    activeConversation(state): ConversationType | undefined {
      // Prefer the pinned snapshot (survives list filtering / search).
      if (
        state.activeConversationInfo &&
        state.activeConversationInfo.id === state.activeConversationId
      ) {
        return state.activeConversationInfo
      }
      return state.conversations.data.find(
        (c) => c.id === state.activeConversationId
      )
    },
    // Usage: chatStore.isOnline(userId)
    isOnline(state) {
      return (userId?: number | null): boolean =>
        userId != null && !!state.onlineUsers[userId]
    },
    uploading(state): boolean {
      return state.uploadingItems.length > 0
    },
    // Human-readable "X is typing…" label for the open conversation.
    activeTypingLabel(state): string {
      if (state.activeConversationId == null) return ''
      const ids = state.typingUsers[state.activeConversationId] || []
      if (!ids.length) return ''
      const conv = state.activeConversationInfo
      const nameOf = (id: number): string => {
        if (conv && conv.type === 'direct') return conv.other_user_name || 'Someone'
        const m = state.membersPanel.data.find((mm) => mm.user_id === id)
        return m ? m.name.split(' ')[0] : 'Someone'
      }
      const names = ids.map(nameOf)
      if (ids.length === 1) return `${names[0]} is typing…`
      if (ids.length === 2) return `${names[0]} and ${names[1]} are typing…`
      return 'Several people are typing…'
    },
    isThread(state): boolean {
      return !!state.activeConversationInfo?.parent_id
    },
    // Candidates for @mention in the active conversation.
    mentionCandidates(state): { user_id: number; name: string }[] {
      const me = state.meId
      const groupLike =
        state.activeConversationInfo?.type === 'group' ||
        !!state.activeConversationInfo?.parent_id
      if (groupLike) {
        return state.membersPanel.data
          .filter((m) => m.user_id !== me)
          .map((m) => ({ user_id: m.user_id, name: m.name }))
      }
      const c = state.activeConversationInfo
      if (c?.other_user_id) {
        return [{ user_id: c.other_user_id, name: c.other_user_name || 'User' }]
      }
      return []
    },
    // A message is "seen" by a user when they've read past it AND read at or
    // after its last change — so editing a message resets its seen state until
    // the reader reads again.
    readInfo(state) {
      return (msg: MessageType): { count: number; seen: boolean } => {
        const readers = state.readState[msg.conversation_id] || {}
        const me = state.meId
        const effective = parseTs(msg.edited_at || msg.created_at)
        let count = 0
        for (const key of Object.keys(readers)) {
          const uid = Number(key)
          if (uid === me) continue
          const r = readers[uid]
          if (r && r.id >= msg.id && parseTs(r.at) >= effective) count++
        }
        return { count, seen: count > 0 }
      }
    },
    // The list of users who have read a given message (name-resolved, with time).
    readersOf(state) {
      return (msg: MessageType): { user_id: number; name: string; at: string }[] => {
        const readers = state.readState[msg.conversation_id] || {}
        const me = state.meId
        const effective = parseTs(msg.edited_at || msg.created_at)
        const out: { user_id: number; name: string; at: string }[] = []
        for (const key of Object.keys(readers)) {
          const uid = Number(key)
          if (uid === me) continue
          const r = readers[uid]
          if (!r || r.id < msg.id || parseTs(r.at) < effective) continue
          const mem = state.membersPanel.data.find((m) => m.user_id === uid)
          let name = mem?.name
          if (!name && state.activeConversationInfo?.other_user_id === uid) {
            name = state.activeConversationInfo?.other_user_name || undefined
          }
          out.push({ user_id: uid, name: name || 'User', at: r.at })
        }
        return out
      }
    }
  },

  actions: {
    // ---- REST ----
    async fetchConversations() {
      this.conversations.loading = true
      try {
        const response = await useMyFetch().post('/v1/chats/index-conversation', {
          global: this.globalSearch || '',
          per_page: 50,
          page: 1
        })
        this.conversations.data = response.data?.data || []
        this.conversations.meta = response.data?.meta || ({} as Meta)
        // Seed presence from the server-computed online flag on each row.
        for (const conv of this.conversations.data) {
          if (conv.other_user_id != null) {
            this.onlineUsers[conv.other_user_id] = !!conv.online
          }
        }
      } catch (error: any) {
        useAlert.alertError(
          error?.response?.data?.message || 'Failed to load conversations'
        )
      } finally {
        this.conversations.loading = false
      }
    },

    async openConversation(conversationId: number, info?: ConversationType) {
      this.activeConversationId = conversationId
      // Pin the conversation info. Threads aren't in the main list, so hydrate
      // them via show-conversation.
      let found = info || this.conversations.data.find((c) => c.id === conversationId)
      if (!found) {
        try {
          const res = await useMyFetch().post('/v1/chats/show-conversation', {
            conversation_id: conversationId
          })
          found = res.data?.data || undefined
        } catch {
          // ignore
        }
      }
      if (found) this.activeConversationInfo = found
      this.messages.data = []
      this.messages.hasMore = true
      this.clearReply()
      this.cancelEdit()
      this.stagedAttachments = []
      // Seed read receipts.
      const convInfo = this.activeConversationInfo
      if (convInfo?.type === 'direct' && convInfo.other_user_id) {
        this.readState[conversationId] = {
          [convInfo.other_user_id]: {
            id: convInfo.other_user_last_read || 0,
            at: convInfo.other_user_last_read_at || ''
          }
        }
      }
      // For groups/threads, preload members so mentions / typing resolve names.
      if (convInfo?.type === 'group' || convInfo?.parent_id) {
        this.fetchMembers()
      } else {
        this.membersPanel.data = []
      }
      await this.fetchMessages(conversationId)
      await this.markRead(conversationId)
    },

    // Open a thread conversation (hydrates its header via show-conversation).
    async openThread(threadId: number) {
      this.threadsPanel.open = false
      await this.openConversation(threadId)
    },

    // Return from a thread to its parent conversation.
    async backToParent() {
      const parent = this.activeConversationInfo?.parent_id
      if (parent) await this.openConversation(parent)
    },

    closeConversation() {
      this.activeConversationId = null
      this.activeConversationInfo = null
      this.messages.data = []
      this.clearReply()
      this.cancelEdit()
      this.stagedAttachments = []
    },

    async fetchMessages(conversationId: number, beforeId?: number) {
      this.messages.loading = true
      try {
        const response = await useMyFetch().post('/v1/chats/index-message', {
          conversation_id: conversationId,
          before_id: beforeId || null,
          per_page: 30
        })
        const batch: MessageType[] = response.data?.data || []
        if (beforeId) {
          // older page -> prepend, keep scroll anchored by the caller
          this.messages.data = [...batch, ...this.messages.data]
        } else {
          this.messages.data = batch
        }
        this.messages.hasMore = batch.length >= 30
      } catch (error: any) {
        useAlert.alertError(
          error?.response?.data?.message || 'Failed to load messages'
        )
      } finally {
        this.messages.loading = false
      }
    },

    async startAIChat() {
      try {
        const res = await useMyFetch().post('/v1/chats/start-ai', {})
        const conversationId = res.data?.data?.conversation_id
        this.userPicker.open = false
        await this.fetchConversations()
        if (conversationId) await this.openConversation(conversationId)
        return conversationId
      } catch (error: any) {
        useAlert.alertError(
          error?.response?.data?.message || 'AI assistant is unavailable'
        )
      }
    },

    async startConversationWith(userId: number) {
      try {
        const response = await useMyFetch().post('/v1/chats/start-conversation', {
          user_id: userId
        })
        const conversationId = response.data?.data?.conversation_id
        this.userPicker.open = false
        await this.fetchConversations()
        if (conversationId) await this.openConversation(conversationId)
        return conversationId
      } catch (error: any) {
        useAlert.alertError(
          error?.response?.data?.message || 'Failed to start conversation'
        )
      }
    },

    async sendMessage(content: string) {
      const text = content.trim()
      const attachments = [...this.stagedAttachments]
      if ((!text && !attachments.length) || !this.activeConversationId || this.sending)
        return
      this.sending = true

      const conversationId = this.activeConversationId
      const replyToId = this.replyTo?.id || null
      const replyPreview = this.replyTo
        ? {
            id: this.replyTo.id,
            sender_name: this.replyTo.sender_name,
            content: this.replyTo.content,
            deleted_for_all: this.replyTo.deleted_for_all
          }
        : null
      const mentionIds = [...this.mentionIds]
      // Optimistic message with a temporary negative id.
      const tempId = -Date.now()
      const optimistic: MessageType = {
        id: tempId,
        conversation_id: conversationId,
        sender_id: this.meId || currentUserId() || 0,
        sender_name: 'Me',
        content: text,
        created_at: new Date().toISOString(),
        reply_to_id: replyToId,
        reply_to: replyPreview,
        attachments: attachments,
        pending: true
      }
      this.messages.data.push(optimistic)
      // Clear composer extras immediately for snappy UX.
      this.clearReply()
      this.stagedAttachments = []

      try {
        const response = await useMyFetch().post('/v1/chats/send-message', {
          conversation_id: conversationId,
          content: text,
          reply_to_id: replyToId,
          mention_ids: mentionIds,
          attachments: attachments.map((a) => ({
            object_key: a.object_key,
            kind: a.kind,
            file_name: a.file_name,
            mime_type: a.mime_type,
            size_bytes: a.size_bytes,
            duration_seconds: a.duration_seconds,
            width: a.width,
            height: a.height,
            description: a.description || null
          }))
        })
        const saved: MessageType = response.data?.data
        const idx = this.messages.data.findIndex((m) => m.id === tempId)
        if (saved) {
          // The websocket echo may have already inserted the persisted message
          // (race between REST response and WS broadcast). If so, just drop the
          // optimistic placeholder instead of adding a duplicate.
          const alreadyPresent = this.messages.data.some(
            (m) => m.id === saved.id
          )
          if (alreadyPresent) {
            if (idx !== -1) this.messages.data.splice(idx, 1)
          } else if (idx !== -1) {
            this.messages.data.splice(idx, 1, saved)
          } else {
            this.messages.data.push(saved)
          }
        }
        this._touchConversationPreview(
          conversationId,
          text || (attachments.length ? '📎 Attachment' : '')
        )
      } catch (error: any) {
        // Roll back the optimistic message on failure.
        this.messages.data = this.messages.data.filter((m) => m.id !== tempId)
        useAlert.alertError(
          error?.response?.data?.message || 'Failed to send message'
        )
      } finally {
        this.sending = false
      }
    },

    async markRead(conversationId: number) {
      const conv = this.conversations.data.find((c) => c.id === conversationId)
      if (conv) conv.unread_count = 0
      try {
        await useMyFetch().post('/v1/chats/read-conversation', {
          conversation_id: conversationId
        })
      } catch {
        // non-critical
      }
    },

    async fetchUsers() {
      this.userPicker.loading = true
      try {
        const response = await useMyFetch().post('/v1/users/index-user', {
          global: this.userPicker.search || '',
          per_page: 30,
          page: 1
        })
        const me = this.meId || currentUserId()
        this.userPicker.data = (response.data?.data || []).filter(
          (u: ChatUserType) => u.id !== me
        )
      } catch (error: any) {
        useAlert.alertError(
          error?.response?.data?.message || 'Failed to load users'
        )
      } finally {
        this.userPicker.loading = false
      }
    },

    // ---- attachments ----
    async uploadFiles(files: File[] | FileList, extra?: Partial<AttachmentType>) {
      const list = Array.from(files)
      if (!list.length) return
      const token = currentToken()
      const base = String(useRuntimeConfig().public.API || '')

      for (const file of list) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        this.uploadingItems.push({ id, name: file.name, percent: 0 })
        try {
          const data = await this._xhrUpload(
            `${base}/v1/chats/upload`,
            file,
            token,
            (pct) => {
              const it = this.uploadingItems.find((x) => x.id === id)
              if (it) it.percent = pct
            }
          )
          if (data) this.stagedAttachments.push({ ...data, ...extra } as AttachmentType)
          else useAlert.alertError('Upload failed')
        } catch {
          useAlert.alertError('Upload failed')
        } finally {
          this.uploadingItems = this.uploadingItems.filter((x) => x.id !== id)
        }
      }
    },

    // XHR upload so we get real per-file progress events.
    _xhrUpload(
      url: string,
      file: File,
      token: string | null,
      onProgress: (pct: number) => void
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
        }
        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText)
            resolve(json?.data || null)
          } catch {
            resolve(null)
          }
        }
        xhr.onerror = () => reject(new Error('network error'))
        const fd = new FormData()
        fd.append('file', file)
        xhr.send(fd)
      })
    },

    removeStaged(index: number) {
      this.stagedAttachments.splice(index, 1)
    },

    // ---- voice recording ----
    async startRecording() {
      if (this.recording.active) return
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {
        useAlert.alertError('Microphone access denied')
        return
      }
      cancelRecordingFlag = false
      recordChunks = []
      const mime = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/ogg')
          ? 'audio/ogg'
          : ''
      mediaRecorder = mime
        ? new MediaRecorder(mediaStream, { mimeType: mime })
        : new MediaRecorder(mediaStream)
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size) recordChunks.push(e.data)
      }
      mediaRecorder.onstop = async () => {
        const seconds = this.recording.seconds
        if (mediaStream) {
          mediaStream.getTracks().forEach((t) => t.stop())
          mediaStream = null
        }
        if (recordTimer) {
          clearInterval(recordTimer)
          recordTimer = null
        }
        this.recording.active = false
        this.recording.seconds = 0
        if (cancelRecordingFlag || !recordChunks.length) return
        const type = mediaRecorder?.mimeType || 'audio/webm'
        const blob = new Blob(recordChunks, { type })
        const ext = type.includes('ogg') ? 'ogg' : 'webm'
        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type })
        await this.uploadFiles([file], { duration_seconds: seconds })
      }
      mediaRecorder.start()
      this.recording.active = true
      this.recording.seconds = 0
      recordTimer = setInterval(() => {
        this.recording.seconds += 1
        if (this.recording.seconds >= 300) this.stopRecording() // 5-min cap
      }, 1000)
    },

    stopRecording() {
      cancelRecordingFlag = false
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
    },

    cancelRecording() {
      cancelRecordingFlag = true
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop()
    },

    // ---- reply / mentions ----
    setReplyTo(message: MessageType) {
      this.replyTo = message
    },
    clearReply() {
      this.replyTo = null
      this.mentionIds = []
    },
    addMention(userId: number) {
      if (!this.mentionIds.includes(userId)) this.mentionIds.push(userId)
    },

    // ---- edit ----
    startEdit(message: MessageType) {
      this.editing.id = message.id
      this.editing.content = message.content
    },
    cancelEdit() {
      this.editing.id = null
      this.editing.content = ''
    },
    async submitEdit(content: string) {
      const id = this.editing.id
      const text = content.trim()
      if (!id || !text) return
      try {
        const res = await useMyFetch().post('/v1/chats/edit-message', {
          message_id: id,
          content: text
        })
        const updated: MessageType = res.data?.data
        const m = this.messages.data.find((x) => x.id === id)
        if (m && updated) {
          m.content = updated.content
          m.edited_at = updated.edited_at
        }
        this.cancelEdit()
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to edit message')
      }
    },

    // ---- reactions ----
    async toggleReaction(message: MessageType, emoji: string) {
      const group = (message.reactions || []).find((g) => g.emoji === emoji)
      const add = !(group && group.reacted)
      const url = add ? '/v1/chats/react-message' : '/v1/chats/unreact-message'
      try {
        const res = await useMyFetch().post(url, { message_id: message.id, emoji })
        this._applyReactions(message.id, res.data?.data || [])
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to react')
      }
    },
    _applyReactions(messageId: number, groups: ReactionGroupType[]) {
      const me = this.meId || currentUserId()
      const withReacted = groups.map((g) => ({
        ...g,
        reacted: (g.user_ids || []).includes(me as number)
      }))
      const m = this.messages.data.find((x) => x.id === messageId)
      if (m) m.reactions = withReacted
    },

    // ---- threads ----
    async createThread(rootMessageId: number, title?: string) {
      if (!this.activeConversationId) return
      try {
        const res = await useMyFetch().post('/v1/chats/create-thread', {
          conversation_id: this.activeConversationId,
          root_message_id: rootMessageId,
          title: title || null
        })
        const tid = res.data?.data?.conversation_id
        if (tid) await this.openThread(tid)
        return tid
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to create thread')
      }
    },
    async fetchThreads() {
      const parent =
        this.activeConversationInfo?.parent_id || this.activeConversationId
      if (!parent) return
      this.threadsPanel.loading = true
      try {
        const res = await useMyFetch().post('/v1/chats/index-thread', {
          conversation_id: parent
        })
        this.threadsPanel.data = res.data?.data || []
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to load threads')
      } finally {
        this.threadsPanel.loading = false
      }
    },
    // ---- read receipts ----
    _setRead(conversationId: number, userId: number, lastReadId: number, at: string) {
      if (!this.readState[conversationId]) this.readState[conversationId] = {}
      this.readState[conversationId][userId] = { id: lastReadId, at }
    },

    // ---- rename / describe (group or thread) ----
    async updateConversation(payload: { title?: string; description?: string }) {
      if (!this.activeConversationId) return
      try {
        await useMyFetch().post('/v1/chats/update-conversation', {
          conversation_id: this.activeConversationId,
          title: payload.title ?? null,
          description: payload.description ?? null
        })
        if (this.activeConversationInfo) {
          if (payload.title != null) this.activeConversationInfo.title = payload.title
          if (payload.description != null)
            this.activeConversationInfo.description = payload.description
        }
        await this.fetchConversations()
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to update')
      }
    },

    // ---- start a DM with a user (from a profile card) ----
    async messageUser(userId: number) {
      // Close any open group-info overlays so they don't linger over the new DM.
      this.profilePanel.open = false
      this.membersPanel.open = false
      this.threadsPanel.open = false
      await this.startConversationWith(userId)
    },

    async openThreadsPanel(tab: 'threads' | 'info' = 'threads') {
      this.threadsPanel.open = true
      this.threadsPanel.tab = tab
      await this.fetchThreads()
      if (
        this.activeConversationInfo?.type === 'group' ||
        this.activeConversationInfo?.parent_id
      ) {
        await this.fetchMembers()
      }
    },

    // ---- groups ----
    async _searchUsers(term: string): Promise<ChatUserType[]> {
      try {
        const res = await useMyFetch().post('/v1/users/index-user', {
          global: term || '',
          per_page: 30,
          page: 1
        })
        const me = this.meId || currentUserId()
        return (res.data?.data || []).filter((u: ChatUserType) => u.id !== me)
      } catch {
        return []
      }
    },

    async fetchGroupPickerUsers() {
      this.groupPicker.loading = true
      try {
        this.groupPicker.data = await this._searchUsers(this.groupPicker.search)
      } finally {
        this.groupPicker.loading = false
      }
    },

    toggleGroupMember(userId: number) {
      const i = this.groupPicker.selected.indexOf(userId)
      if (i === -1) this.groupPicker.selected.push(userId)
      else this.groupPicker.selected.splice(i, 1)
    },

    async createGroup() {
      const title = this.groupPicker.title.trim()
      if (!title || this.groupPicker.selected.length === 0) {
        useAlert.alertError('Enter a group name and pick at least one member')
        return
      }
      this.groupPicker.creating = true
      try {
        const res = await useMyFetch().post('/v1/chats/create-group', {
          title,
          member_ids: this.groupPicker.selected
        })
        const conversationId = res.data?.data?.conversation_id
        this.groupPicker.open = false
        this.groupPicker.title = ''
        this.groupPicker.selected = []
        this.groupPicker.search = ''
        await this.fetchConversations()
        if (conversationId) await this.openConversation(conversationId)
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to create group')
      } finally {
        this.groupPicker.creating = false
      }
    },

    // ---- members ----
    async openMembers() {
      this.membersPanel.open = true
      await this.fetchMembers()
    },

    async fetchMembers() {
      if (!this.activeConversationId) return
      this.membersPanel.loading = true
      try {
        const res = await useMyFetch().post('/v1/chats/index-member', {
          conversation_id: this.activeConversationId
        })
        this.membersPanel.data = res.data?.data || []
        const cid = this.activeConversationId
        const readMap: Record<number, ReadEntry> = {}
        for (const m of this.membersPanel.data) {
          this.onlineUsers[m.user_id] = !!m.online
          readMap[m.user_id] = { id: m.last_read_message_id || 0, at: m.last_read_at || '' }
        }
        if (cid) this.readState[cid] = readMap
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to load members')
      } finally {
        this.membersPanel.loading = false
      }
    },

    async fetchAddMemberUsers() {
      this.addMemberPicker.loading = true
      try {
        const existing = new Set(this.membersPanel.data.map((m) => m.user_id))
        const users = await this._searchUsers(this.addMemberPicker.search)
        this.addMemberPicker.data = users.filter((u) => !existing.has(u.id))
      } finally {
        this.addMemberPicker.loading = false
      }
    },

    async addMembers(userIds: number[]) {
      if (!this.activeConversationId || userIds.length === 0) return
      try {
        await useMyFetch().post('/v1/chats/add-member', {
          conversation_id: this.activeConversationId,
          member_ids: userIds
        })
        this.addMemberPicker.open = false
        await this.fetchMembers()
        await this.fetchConversations()
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to add members')
      }
    },

    async removeMember(userId: number) {
      if (!this.activeConversationId) return
      try {
        await useMyFetch().post('/v1/chats/remove-member', {
          conversation_id: this.activeConversationId,
          user_id: userId
        })
        await this.fetchMembers()
        await this.fetchConversations()
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to remove member')
      }
    },

    async setMemberRole(userId: number, role: string) {
      if (!this.activeConversationId) return
      try {
        await useMyFetch().post('/v1/chats/set-member-role', {
          conversation_id: this.activeConversationId,
          user_id: userId,
          role
        })
        await this.fetchMembers()
        await this.fetchConversations()
        // My own role may have changed (ownership transfer).
        const mine = this.membersPanel.data.find(
          (m) => m.user_id === (this.meId || currentUserId())
        )
        if (mine && this.activeConversationInfo) {
          this.activeConversationInfo.my_role = mine.role
        }
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to update role')
      }
    },

    async leaveGroup() {
      if (!this.activeConversationId) return
      try {
        await useMyFetch().post('/v1/chats/leave-conversation', {
          conversation_id: this.activeConversationId
        })
        this.membersPanel.open = false
        this.closeConversation()
        await this.fetchConversations()
        useAlert.alertSuccess('You left the group')
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to leave')
      }
    },

    // ---- profile ----
    async openProfile(userId: number) {
      this.profilePanel.open = true
      this.profilePanel.loading = true
      this.profilePanel.data = null
      try {
        const res = await useMyFetch().post('/v1/chats/show-profile', {
          conversation_id: this.activeConversationId,
          user_id: userId
        })
        this.profilePanel.data = res.data?.data || null
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to load profile')
      } finally {
        this.profilePanel.loading = false
      }
    },

    // ---- delete message ----
    async deleteMessage(messageId: number, scope: 'me' | 'everyone') {
      try {
        await useMyFetch().post('/v1/chats/delete-message', {
          message_id: messageId,
          scope
        })
        if (scope === 'me') {
          this.messages.data = this.messages.data.filter((m) => m.id !== messageId)
        } else {
          const m = this.messages.data.find((x) => x.id === messageId)
          if (m) {
            m.deleted_for_all = true
            m.content = ''
            m.attachments = []
          }
        }
      } catch (e: any) {
        useAlert.alertError(e?.response?.data?.message || 'Failed to delete message')
      }
    },

    // ---- typing ----
    sendTyping() {
      if (!this.activeConversationId) return
      const now = Date.now()
      if (now - lastTypingSent < 2500) return
      lastTypingSent = now
      this._wsSend({ type: 'typing', conversation_id: this.activeConversationId })
    },

    _wsSend(obj: any) {
      if (socket && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(JSON.stringify(obj))
        } catch {
          // ignore
        }
      }
    },

    _markTyping(conversationId: number, userId: number) {
      const list = this.typingUsers[conversationId] || []
      if (!list.includes(userId)) {
        this.typingUsers[conversationId] = [...list, userId]
      }
      const key = `${conversationId}:${userId}`
      if (typingTimers[key]) clearTimeout(typingTimers[key])
      typingTimers[key] = setTimeout(() => {
        const cur = this.typingUsers[conversationId] || []
        this.typingUsers[conversationId] = cur.filter((id) => id !== userId)
        delete typingTimers[key]
      }, 4000)
    },

    _clearTyping(conversationId: number, userId: number) {
      const key = `${conversationId}:${userId}`
      if (typingTimers[key]) {
        clearTimeout(typingTimers[key])
        delete typingTimers[key]
      }
      const cur = this.typingUsers[conversationId]
      if (cur) this.typingUsers[conversationId] = cur.filter((id) => id !== userId)
    },

    // ---- helpers ----
    _msgPreview(msg: MessageType): string {
      if (msg.content) return msg.content
      const a = msg.attachments && msg.attachments[0]
      if (a) {
        const label =
          a.kind === 'image'
            ? '📷 Photo'
            : a.kind === 'video'
              ? '🎬 Video'
              : a.kind === 'voice'
                ? '🎤 Voice message'
                : '📎 ' + (a.file_name || 'Attachment')
        return label
      }
      return ''
    },
    _touchConversationPreview(conversationId: number, text: string) {
      const conv = this.conversations.data.find((c) => c.id === conversationId)
      if (conv) {
        conv.last_message_text = text
        conv.last_message_at = new Date().toISOString()
        // move to top
        this.conversations.data = [
          conv,
          ...this.conversations.data.filter((c) => c.id !== conversationId)
        ]
      }
    },

    // ---- WebSocket ----
    connect() {
      if (process.server) return
      const token = currentToken()
      if (!token) return
      this.meId = currentUserId()
      manuallyClosed = false

      // Avoid duplicate connections.
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING)
      ) {
        return
      }

      try {
        socket = new WebSocket(buildWsUrl(token))
      } catch {
        this._scheduleReconnect()
        return
      }

      socket.onopen = () => {
        this.connected = true
        reconnectAttempts = 0
      }

      socket.onmessage = (event) => {
        try {
          const env: WSEnvelope = JSON.parse(event.data)
          this._handleEnvelope(env)
        } catch {
          // ignore malformed frames
        }
      }

      socket.onclose = () => {
        this.connected = false
        socket = null
        if (!manuallyClosed) this._scheduleReconnect()
      }

      socket.onerror = () => {
        socket?.close()
      }
    },

    disconnect() {
      manuallyClosed = true
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
      if (socket) {
        socket.close()
        socket = null
      }
      this.connected = false
    },

    _scheduleReconnect() {
      if (manuallyClosed) return
      if (reconnectTimer) return
      reconnectAttempts += 1
      const delay = Math.min(30000, 1000 * 2 ** Math.min(reconnectAttempts, 5))
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        this.connect()
      }, delay)
    },

    _handleEnvelope(env: WSEnvelope) {
      if (env.type === 'message') {
        this._onIncomingMessage(env.payload as MessageType)
      } else if (env.type === 'presence') {
        // A single contact's status changed.
        const p = env.payload || {}
        if (p.user_id != null) {
          this.onlineUsers[p.user_id] = !!p.online
        }
      } else if (env.type === 'presence_snapshot') {
        // Authoritative list of which of my contacts are online right now.
        const ids: number[] = env.payload?.online_user_ids || []
        const set = new Set(ids)
        // Reset every known contact against the snapshot, then mark the online ones.
        for (const conv of this.conversations.data) {
          if (conv.other_user_id != null) {
            this.onlineUsers[conv.other_user_id] = set.has(conv.other_user_id)
          }
        }
        ids.forEach((id) => {
          this.onlineUsers[id] = true
        })
      } else if (env.type === 'typing') {
        const p = env.payload || {}
        if (p.conversation_id != null && p.user_id != null) {
          this._markTyping(p.conversation_id, p.user_id)
        }
      } else if (env.type === 'message_deleted') {
        const p = env.payload || {}
        const m = this.messages.data.find((x) => x.id === p.message_id)
        if (m) {
          m.deleted_for_all = true
          m.content = ''
          m.attachments = []
        }
        // Refresh the list preview if it referenced this message.
        this.fetchConversations()
      } else if (env.type === 'message_edited') {
        const p = env.payload || {}
        const m = this.messages.data.find((x) => x.id === p.id)
        if (m) {
          m.content = p.content
          m.edited_at = p.edited_at
        }
        // If I'm viewing this thread, I've now seen the edited version — re-mark
        // read so the sender's "seen" indicator updates with a fresh timestamp.
        if (
          p.conversation_id === this.activeConversationId &&
          p.sender_id !== (this.meId || currentUserId())
        ) {
          this.markRead(p.conversation_id)
        }
      } else if (env.type === 'reaction_updated') {
        const p = env.payload || {}
        if (p.message_id != null) {
          this._applyReactions(p.message_id, p.reactions || [])
        }
      } else if (env.type === 'thread_created') {
        const p = env.payload || {}
        const rm = this.messages.data.find((x) => x.id === p.root_message_id)
        if (rm) {
          rm.thread_conversation_id = p.thread_conversation_id
          rm.thread_reply_count = rm.thread_reply_count || 0
        }
        if (this.threadsPanel.open) this.fetchThreads()
      } else if (env.type === 'conversation_updated') {
        const p = env.payload || {}
        if (p.removed && p.conversation_id === this.activeConversationId) {
          this.closeConversation()
          this.membersPanel.open = false
          useAlert.alertError('You were removed from the conversation')
        }
        this.fetchConversations()
        if (this.membersPanel.open && p.conversation_id === this.activeConversationId) {
          this.fetchMembers()
        }
      } else if (env.type === 'read') {
        const p = env.payload || {}
        if (p.conversation_id != null && p.user_id != null) {
          this._setRead(
            p.conversation_id,
            p.user_id,
            p.last_read_message_id || 0,
            p.last_read_at || ''
          )
        }
      }
    },

    _onIncomingMessage(msg: MessageType) {
      if (!msg || !msg.conversation_id) return

      // A real message from a user stops their typing indicator.
      this._clearTyping(msg.conversation_id, msg.sender_id)

      if (msg.conversation_id === this.activeConversationId) {
        // Already have this exact (persisted) message -> ignore the echo.
        const exists = this.messages.data.some((m) => m.id === msg.id)
        if (!exists) {
          // If this echo is our own message and an optimistic placeholder is
          // still pending, reconcile it in place instead of appending a copy
          // (handles the WS-echo-arrives-before-REST-response race).
          const myId = this.meId || currentUserId()
          const pendingIdx =
            msg.sender_id === myId
              ? this.messages.data.findIndex(
                  (m) => m.pending && m.content === msg.content
                )
              : -1
          if (pendingIdx !== -1) {
            this.messages.data.splice(pendingIdx, 1, msg)
          } else {
            this.messages.data.push(msg)
          }
        }
        // We are looking at it -> mark read.
        this.markRead(msg.conversation_id)
        this._touchConversationPreview(msg.conversation_id, this._msgPreview(msg))
      } else {
        // Update preview + unread badge for a background conversation.
        const conv = this.conversations.data.find(
          (c) => c.id === msg.conversation_id
        )
        if (conv) {
          conv.last_message_text = this._msgPreview(msg)
          conv.last_message_at = msg.created_at || new Date().toISOString()
          if (msg.sender_id !== (this.meId || currentUserId())) {
            conv.unread_count = (conv.unread_count || 0) + 1
          }
          this.conversations.data = [
            conv,
            ...this.conversations.data.filter((c) => c.id !== conv.id)
          ]
        } else {
          // Unknown conversation (e.g. first message from a new contact).
          this.fetchConversations()
        }
      }
    }
  }
})

export default useChatStore
