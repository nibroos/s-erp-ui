<script setup lang="ts">
import { storeToRefs } from "pinia";
import useLayoutsStore from "~/stores/configs/LayoutsStore";
import useChatStore from "~/stores/supports/ChatStore";
import type {
  AttachmentType,
  ConversationType,
  MemberType,
  MessageType,
} from "~/types/ChatType";

definePageMeta({
  layout: "auth",
  middleware: ["auth"],
});

useHead({ title: "Chat" });

const chatStore = useChatStore();
const {
  conversations,
  messages,
  activeConversationId,
  sending,
  connected,
  userPicker,
  groupPicker,
  membersPanel,
  addMemberPicker,
  profilePanel,
  replyTo,
  editing,
  threadsPanel,
  stagedAttachments,
  uploading,
  uploadingItems,
  recording,
} = storeToRefs(chatStore);

// Media lightbox (gallery of a message's images + videos)
const lightbox = ref({ open: false, items: [] as AttachmentType[], index: 0 });
const openLightbox = (msg: MessageType, att: AttachmentType) => {
  const media = (msg.attachments || []).filter(
    (a) => a.kind === "image" || a.kind === "video"
  );
  const idx = media.indexOf(att);
  lightbox.value = { open: true, items: media, index: Math.max(0, idx) };
};
const lightboxCurrent = computed(() => lightbox.value.items[lightbox.value.index]);
const lightboxPrev = () => {
  if (lightbox.value.index > 0) lightbox.value.index--;
};
const lightboxNext = () => {
  if (lightbox.value.index < lightbox.value.items.length - 1) lightbox.value.index++;
};
const onLightboxKey = (e: KeyboardEvent) => {
  if (!lightbox.value.open) return;
  if (e.key === "ArrowLeft") lightboxPrev();
  else if (e.key === "ArrowRight") lightboxNext();
  else if (e.key === "Escape") lightbox.value.open = false;
};
onMounted(() => window.addEventListener("keydown", onLightboxKey));
onBeforeUnmount(() => window.removeEventListener("keydown", onLightboxKey));

const fileInput = ref<HTMLInputElement | null>(null);
const onPickFiles = () => fileInput.value?.click();
const onFilesSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length) await chatStore.uploadFiles(input.files);
  input.value = "";
};

const formatBytes = (n?: number | null) => {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};
const formatDuration = (sec?: number | null) => {
  const s = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const layoutStore = useLayoutsStore();

const draft = ref("");
const messagesPanel = ref<HTMLElement | null>(null);
const isPrepending = ref(false);

const REACTION_EMOJIS = ["👍", "❤️", "😂", "🎉", "😮", "😢", "🙏"];
const mentionMenu = ref({ open: false, query: "", active: 0 });

const md = useMarkdown();
const renderMarkdown = (src: string) => md.render(src);

const meId = computed(() => chatStore.meId ?? 0);
const active = computed(() => chatStore.activeConversation);
const isAI = computed(() => !!active.value?.other_user_is_ai);
const isGroup = computed(() => active.value?.type === "group");
const isThread = computed(() => !!active.value?.parent_id);
const myRole = computed(() => active.value?.my_role || "member");
const isEditing = computed(() => editing.value.id !== null);

const initials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const scrollToBottom = async (smooth = false) => {
  await nextTick();
  const el = messagesPanel.value;
  if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
};

const openConversation = async (conv: ConversationType) => {
  await chatStore.openConversation(conv.id);
  await scrollToBottom();
};

const goBack = () => chatStore.closeConversation();

const onSubmit = async () => {
  const text = draft.value;
  if (isEditing.value) {
    if (!text.trim()) return;
    draft.value = "";
    mentionMenu.value.open = false;
    await chatStore.submitEdit(text);
    return;
  }
  // Allow sending when there's text OR at least one staged attachment.
  if (!text.trim() && !stagedAttachments.value.length) return;
  draft.value = "";
  mentionMenu.value.open = false;
  await chatStore.sendMessage(text);
  await scrollToBottom(true);
};

// ---- reply / edit / mentions ----
const onReply = (msg: MessageType) => {
  chatStore.cancelEdit();
  chatStore.setReplyTo(msg);
};
const onEditMessage = (msg: MessageType) => {
  chatStore.clearReply();
  chatStore.startEdit(msg);
  draft.value = msg.content;
  nextTick(() => scrollToBottom(true));
};
const cancelComposer = () => {
  chatStore.clearReply();
  chatStore.cancelEdit();
  draft.value = "";
  mentionMenu.value.open = false;
};

// Detect a trailing "@query" token to drive the mention dropdown.
const onComposerInput = () => {
  if (!isEditing.value) chatStore.sendTyping();
  const m = draft.value.match(/(?:^|\s)@([\p{L}\d._-]*)$/u);
  if (m && chatStore.mentionCandidates.length) {
    mentionMenu.value.open = true;
    mentionMenu.value.query = m[1].toLowerCase();
    mentionMenu.value.active = 0;
  } else {
    mentionMenu.value.open = false;
  }
};
const mentionMatches = computed(() =>
  chatStore.mentionCandidates
    .filter((c) => c.name.toLowerCase().includes(mentionMenu.value.query))
    .slice(0, 6)
);
const pickMention = (c: { user_id: number; name: string }) => {
  draft.value = draft.value.replace(/@([\p{L}\d._-]*)$/u, `@${c.name} `);
  chatStore.addMention(c.user_id);
  mentionMenu.value.open = false;
};

// Composer keydown: drive mention nav (↑/↓, Enter/Tab to pick), else submit.
const onComposerKeydown = (e: KeyboardEvent) => {
  const matches = mentionMatches.value;
  if (mentionMenu.value.open && matches.length) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      mentionMenu.value.active = (mentionMenu.value.active + 1) % matches.length;
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      mentionMenu.value.active =
        (mentionMenu.value.active - 1 + matches.length) % matches.length;
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      pickMention(matches[mentionMenu.value.active] || matches[0]);
      return;
    }
    if (e.key === "Escape") {
      mentionMenu.value.open = false;
      return;
    }
  }
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSubmit();
  }
};

// Tokenize content into text / clickable url / clickable @mention parts.
type Token = { kind: "text" | "url" | "mention"; text: string; href?: string; userId?: number };
const renderTokens = (msg: MessageType): Token[] => {
  const content = msg.content || "";
  const mentions = msg.mentions || [];
  const tokens: Token[] = [];
  const re = /(https?:\/\/[^\s]+)|(@[\p{L}][\p{L}\d._-]*)/gu;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    if (m.index > last) tokens.push({ kind: "text", text: content.slice(last, m.index) });
    if (m[1]) {
      tokens.push({ kind: "url", text: m[1], href: m[1] });
    } else {
      const q = m[2].slice(1).toLowerCase();
      const hit = mentions.find(
        (x) =>
          x.name.toLowerCase().startsWith(q) ||
          x.name.split(/\s+/)[0].toLowerCase() === q
      );
      tokens.push({ kind: "mention", text: m[2], userId: hit?.user_id });
    }
    last = m.index + m[0].length;
  }
  if (last < content.length) tokens.push({ kind: "text", text: content.slice(last) });
  return tokens.length ? tokens : [{ kind: "text", text: content }];
};

// Id of my most recent (real) message — where the read receipt is shown.
const lastMineId = computed(() => {
  let id = -1;
  for (const m of messages.value.data) {
    if (m.sender_id === meId.value && !m.pending && m.type !== "system" && !m.deleted_for_all) {
      id = m.id;
    }
  }
  return id;
});

// ---- reactions ----
const quickReact = (msg: MessageType, emoji: string) => chatStore.toggleReaction(msg, emoji);

// ---- threads ----
const openThreadFromMsg = (msg: MessageType) => {
  if (msg.thread_conversation_id) chatStore.openThread(msg.thread_conversation_id);
};
const replyInThread = (msg: MessageType) => chatStore.createThread(msg.id, undefined);
const canEdit = (msg: MessageType) =>
  msg.sender_id === meId.value && !msg.deleted_for_all && msg.type !== "system";

const onScrollTop = async () => {
  const el = messagesPanel.value;
  if (!el || el.scrollTop > 40) return;
  if (!messages.value.hasMore || messages.value.loading) return;
  const oldest = messages.value.data[0];
  if (!oldest) return;
  isPrepending.value = true;
  const prevHeight = el.scrollHeight;
  await chatStore.fetchMessages(activeConversationId.value as number, oldest.id);
  await nextTick();
  el.scrollTop = el.scrollHeight - prevHeight;
  isPrepending.value = false;
};

// ---- new chat / group ----
const openUserPicker = async () => {
  userPicker.value.open = true;
  userPicker.value.search = "";
  await chatStore.fetchUsers();
};
const pickUser = async (userId: number) => {
  await chatStore.startConversationWith(userId);
  await scrollToBottom();
};
const openGroupPicker = async () => {
  groupPicker.value.open = true;
  groupPicker.value.title = "";
  groupPicker.value.search = "";
  groupPicker.value.selected = [];
  await chatStore.fetchGroupPickerUsers();
};

// ---- header actions ----
const editDialog = ref({ open: false, tab: "details", title: "", description: "" });
const canEditConv = computed(() => myRole.value === "owner" || myRole.value === "admin");

const onHeaderClick = () => {
  if (isGroup.value || isThread.value) {
    editDialog.value.title = active.value?.title || "";
    editDialog.value.description = active.value?.description || "";
    editDialog.value.tab = "details";
    editDialog.value.open = true;
    chatStore.fetchMembers();
  } else if (active.value?.other_user_id) {
    chatStore.openProfile(active.value.other_user_id);
  }
};

// Close the details dialog whenever we switch conversations (e.g. after
// tapping "Message" on a member — avoids a stale/blank group popup).
watch(activeConversationId, () => {
  editDialog.value.open = false;
});
const saveConvEdit = async () => {
  await chatStore.updateConversation({
    title: editDialog.value.title,
    description: editDialog.value.description,
  });
  editDialog.value.open = false;
};

// ---- members management ----
const canActOn = (m: MemberType) =>
  m.user_id !== meId.value &&
  ((myRole.value === "owner" && m.role !== "owner") ||
    (myRole.value === "admin" && m.role === "member"));
const canRemove = (m: MemberType) =>
  m.role !== "owner" &&
  (myRole.value === "owner" || (myRole.value === "admin" && m.role === "member"));

const doTransfer = async (m: MemberType) => {
  if (confirm(`Transfer ownership to ${m.name}? You will become an admin.`)) {
    await chatStore.setMemberRole(m.user_id, "owner");
  }
};
const doLeave = async () => {
  if (confirm("Leave this group?")) await chatStore.leaveGroup();
};
const openAddMember = async () => {
  addMemberPicker.value.open = true;
  addMemberPicker.value.search = "";
  await chatStore.fetchAddMemberUsers();
};

// ---- delete ----
const canDeleteEveryone = (m: { sender_id: number }) =>
  m.sender_id === meId.value || myRole.value === "owner" || myRole.value === "admin";

// ---- dates ----
const dayKey = (ts?: string | null) => {
  const d = toDate(ts);
  return d ? d.toDateString() : "";
};
const dateLabel = (ts?: string | null) => {
  const d = toDate(ts);
  if (!d) return "";
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
};
const showDaySeparator = (index: number) => {
  const cur = messages.value.data[index];
  if (!cur) return false;
  if (index === 0) return true;
  return dayKey(cur.created_at) !== dayKey(messages.value.data[index - 1].created_at);
};

// Normalise a Postgres timestamp ("2026-07-14 01:14:57.61+00") into something
// Date can reliably parse: space -> "T" and a bare 2-digit tz offset -> "+00:00".
const toDate = (ts?: string | null): Date | null => {
  if (!ts) return null;
  const d = new Date(ts.trim().replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00"));
  return isNaN(d.getTime()) ? null : d;
};

const formatTime = (ts?: string | null) => {
  const d = toDate(ts);
  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
};

// Always show date + time, e.g. "Today 14:32", "Yesterday 09:10",
// "Jul 14, 14:32" (adds the year when it isn't the current one).
const seenTime = (ts?: string | null) => {
  const d = toDate(ts);
  if (!d) return "";
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  let datePart: string;
  if (d.toDateString() === today.toDateString()) datePart = "Today";
  else if (d.toDateString() === yest.toDateString()) datePart = "Yesterday";
  else
    datePart = d.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      ...(d.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}),
    });
  return `${datePart} ${time}`;
};

const roleColor = (role: string) =>
  role === "owner" ? "amber-darken-2" : role === "admin" ? "primary" : "grey";

watch(
  () => messages.value.data.length,
  async (newLen, oldLen) => {
    if (isPrepending.value) return;
    if (newLen < oldLen) return;
    await scrollToBottom(true);
  }
);

let userSearchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => userPicker.value.search,
  () => {
    if (userSearchTimer) clearTimeout(userSearchTimer);
    userSearchTimer = setTimeout(() => chatStore.fetchUsers(), 300);
  }
);
let groupSearchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => groupPicker.value.search,
  () => {
    if (groupSearchTimer) clearTimeout(groupSearchTimer);
    groupSearchTimer = setTimeout(() => chatStore.fetchGroupPickerUsers(), 300);
  }
);
let addSearchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => addMemberPicker.value.search,
  () => {
    if (addSearchTimer) clearTimeout(addSearchTimer);
    addSearchTimer = setTimeout(() => chatStore.fetchAddMemberUsers(), 300);
  }
);
let convSearchTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => chatStore.globalSearch,
  () => {
    if (convSearchTimer) clearTimeout(convSearchTimer);
    convSearchTimer = setTimeout(() => chatStore.fetchConversations(), 300);
  }
);

onMounted(async () => {
  layoutStore.defineTitlePath?.();
  chatStore.connect();
  await chatStore.fetchConversations();
});
onBeforeUnmount(() => chatStore.disconnect());
</script>

<template>
  <div class="pa-4">
    <v-card class="chat-shell" elevation="2" rounded="lg">
      <div class="chat-grid">
        <!-- Conversation list -->
        <aside
          class="chat-sidebar"
          :class="{ 'pane-hidden-mobile': activeConversationId }"
        >
          <div class="d-flex align-center justify-space-between pa-3">
            <div class="d-flex align-center gap-2">
              <span class="text-subtitle-1 font-weight-bold">Chats</span>
              <v-chip size="x-small" :color="connected ? 'green' : 'grey'" variant="flat">
                {{ connected ? "online" : "offline" }}
              </v-chip>
            </div>
            <v-menu location="bottom end">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-plus"
                  size="small"
                  color="primary"
                  variant="tonal"
                />
              </template>
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-account" @click="openUserPicker">
                  <v-list-item-title>New chat</v-list-item-title>
                </v-list-item>
                <v-list-item prepend-icon="mdi-account-group" @click="openGroupPicker">
                  <v-list-item-title>New group</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item prepend-icon="mdi-robot-happy-outline" @click="chatStore.startAIChat()">
                  <v-list-item-title>Ask AI Assistant</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div class="px-3 pb-2">
            <v-text-field
              v-model="chatStore.globalSearch"
              density="compact"
              variant="outlined"
              hide-details
              placeholder="Search name or message"
              prepend-inner-icon="mdi-magnify"
            />
          </div>

          <v-divider />

          <div class="conversation-scroll">
            <v-progress-linear v-if="conversations.loading" indeterminate color="primary" />
            <template v-if="conversations.data.length">
              <button
                v-for="conv in conversations.data"
                :key="conv.id"
                class="conversation-item"
                :class="{ active: conv.id === activeConversationId }"
                @click="openConversation(conv)"
              >
                <div class="avatar-wrap mr-3">
                  <v-avatar
                    size="42"
                    :color="conv.other_user_is_ai ? 'deep-purple' : conv.type === 'group' ? 'indigo' : 'primary'"
                  >
                    <v-icon v-if="conv.other_user_is_ai" color="white">mdi-robot-happy-outline</v-icon>
                    <v-icon v-else-if="conv.type === 'group'" color="white">mdi-account-group</v-icon>
                    <v-img v-else-if="conv.other_user_image" :src="conv.other_user_image" />
                    <span v-else class="text-white text-caption">
                      {{ initials(conv.other_user_name || conv.title || "?") }}
                    </span>
                  </v-avatar>
                  <span
                    v-if="conv.type !== 'group' && !conv.other_user_is_ai"
                    class="presence-dot"
                    :class="chatStore.isOnline(conv.other_user_id) ? 'is-online' : 'is-offline'"
                  />
                </div>
                <div class="conversation-meta">
                  <div class="d-flex justify-space-between align-center">
                    <span class="conversation-name">
                      {{ conv.other_user_name || conv.title || "Unknown" }}
                    </span>
                    <span class="conversation-time">{{ formatTime(conv.last_message_at) }}</span>
                  </div>
                  <div class="d-flex justify-space-between align-center">
                    <span class="conversation-preview">
                      {{ conv.last_message_text || "No messages yet" }}
                    </span>
                    <v-badge
                      v-if="conv.unread_count > 0"
                      :content="conv.unread_count"
                      color="red"
                      inline
                    />
                  </div>
                </div>
              </button>
            </template>
            <div
              v-else-if="!conversations.loading"
              class="pa-6 text-center text-medium-emphasis text-body-2"
            >
              No conversations yet. Click + to start one.
            </div>
          </div>
        </aside>

        <!-- Message thread -->
        <section class="chat-main" :class="{ 'pane-hidden-mobile': !activeConversationId }">
          <template v-if="activeConversationId">
            <header class="chat-header">
              <v-btn
                v-if="isThread"
                icon="mdi-arrow-left"
                variant="text"
                size="small"
                class="mr-1"
                @click="chatStore.backToParent()"
              />
              <v-btn
                v-else
                class="mobile-only mr-1"
                icon="mdi-arrow-left"
                variant="text"
                size="small"
                @click="goBack"
              />
              <div class="header-id" @click="onHeaderClick">
                <div class="avatar-wrap mr-3">
                  <v-avatar size="38" :color="isAI || isThread ? 'deep-purple' : isGroup ? 'indigo' : 'primary'">
                    <v-icon v-if="isAI" color="white">mdi-robot-happy-outline</v-icon>
                    <v-icon v-else-if="isThread" color="white">mdi-comment-multiple-outline</v-icon>
                    <v-icon v-else-if="isGroup" color="white">mdi-account-group</v-icon>
                    <v-img v-else-if="active?.other_user_image" :src="active?.other_user_image" />
                    <span v-else class="text-white text-caption">
                      {{ initials(active?.other_user_name || "?") }}
                    </span>
                  </v-avatar>
                  <span
                    v-if="!isGroup && !isThread && !isAI"
                    class="presence-dot"
                    :class="chatStore.isOnline(active?.other_user_id) ? 'is-online' : 'is-offline'"
                  />
                </div>
                <div>
                  <div class="font-weight-bold d-flex align-center gap-1">
                    <v-icon v-if="isThread" size="14">mdi-comment-multiple-outline</v-icon>
                    {{
                      isThread || isGroup
                        ? active?.title
                        : active?.other_user_name || "Chat"
                    }}
                  </div>
                  <div class="text-caption d-flex align-center gap-1">
                    <span v-if="chatStore.activeTypingLabel" class="text-green status-text">
                      {{ isAI ? "Assistant is typing…" : chatStore.activeTypingLabel }}
                    </span>
                    <template v-else-if="isAI">
                      <span class="text-deep-purple status-text">AI assistant · Markdown</span>
                    </template>
                    <template v-else-if="isThread">
                      <span class="text-medium-emphasis">Thread</span>
                    </template>
                    <template v-else-if="isGroup">
                      <span class="text-medium-emphasis">{{ active?.member_count }} members</span>
                    </template>
                    <template v-else>
                      <span
                        class="status-text"
                        :class="chatStore.isOnline(active?.other_user_id) ? 'text-green' : 'text-medium-emphasis'"
                      >
                        {{ chatStore.isOnline(active?.other_user_id) ? "Online" : "Offline" }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
              <v-spacer />
              <v-btn
                icon="mdi-forum-outline"
                variant="text"
                size="small"
                title="Threads & info"
                @click="chatStore.openThreadsPanel('threads')"
              />
              <v-btn
                v-if="isGroup"
                icon="mdi-account-group"
                variant="text"
                size="small"
                @click="chatStore.openMembers()"
              />
              <v-btn
                v-else-if="active?.other_user_id"
                icon="mdi-information-outline"
                variant="text"
                size="small"
                @click="chatStore.openProfile(active.other_user_id)"
              />
            </header>

            <v-divider />

            <div ref="messagesPanel" class="messages-panel" @scroll="onScrollTop">
              <div
                v-if="messages.loading && !messages.data.length"
                class="text-center pa-4 text-medium-emphasis"
              >
                Loading…
              </div>
              <div v-if="messages.loading && messages.data.length" class="history-loading">
                <v-progress-circular indeterminate size="22" width="2" color="primary" />
              </div>

              <template v-for="(msg, index) in messages.data" :key="msg.id">
                <div v-if="showDaySeparator(index)" class="day-separator">
                  <span class="day-chip">{{ dateLabel(msg.created_at) }}</span>
                </div>

                <!-- System message (e.g. thread started) -->
                <div v-if="msg.type === 'system'" class="system-row">
                  <span class="system-chip">
                    {{ msg.sender_name }} {{ msg.content }}
                  </span>
                </div>

                <div v-else class="message-row" :class="{ mine: msg.sender_id === meId }">
                  <div class="message-bubble" :class="{ pending: msg.pending, deleted: msg.deleted_for_all, ai: msg.sender_is_ai }">
                    <button
                      v-if="isGroup && msg.sender_id !== meId && !msg.deleted_for_all"
                      class="message-sender"
                      @click="chatStore.openProfile(msg.sender_id)"
                    >
                      {{ msg.sender_name }}
                    </button>

                    <!-- Reply quote -->
                    <div v-if="msg.reply_to" class="reply-quote">
                      <div class="reply-quote-name">{{ msg.reply_to.sender_name }}</div>
                      <div class="reply-quote-text">
                        {{ msg.reply_to.deleted_for_all ? "message deleted" : msg.reply_to.content }}
                      </div>
                    </div>

                    <div v-if="msg.deleted_for_all" class="message-text deleted-text">
                      <v-icon size="14">mdi-cancel</v-icon> This message was deleted
                    </div>
                    <!-- AI assistant output rendered as Markdown -->
                    <div
                      v-else-if="msg.sender_is_ai"
                      class="message-text markdown-body"
                      v-html="renderMarkdown(msg.content)"
                    />
                    <div v-else class="message-text">
                      <template v-for="(t, ti) in renderTokens(msg)" :key="ti">
                        <a
                          v-if="t.kind === 'url'"
                          :href="t.href"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="msg-link"
                          @click.stop
                        >{{ t.text }}</a>
                        <span
                          v-else-if="t.kind === 'mention'"
                          class="mention"
                          :class="{ clickable: t.userId }"
                          @click.stop="t.userId && chatStore.openProfile(t.userId)"
                        >{{ t.text }}</span>
                        <template v-else>{{ t.text }}</template>
                      </template>
                    </div>

                    <!-- Attachments -->
                    <div v-if="msg.attachments && msg.attachments.length" class="attachments">
                      <template v-for="(att, ai) in msg.attachments" :key="ai">
                        <div v-if="att.kind === 'image'" class="att-media">
                          <button class="att-image" @click.stop="openLightbox(msg, att)">
                            <img :src="att.url" :alt="att.file_name || 'image'" />
                          </button>
                          <div v-if="att.description" class="att-caption">{{ att.description }}</div>
                        </div>
                        <div v-else-if="att.kind === 'video'" class="att-media">
                          <div class="att-video-wrap">
                            <video
                              :src="att.url"
                              controls
                              preload="metadata"
                              class="att-video"
                              @click.stop
                            />
                            <button
                              class="att-expand"
                              title="Open"
                              @click.stop="openLightbox(msg, att)"
                            >
                              <v-icon size="16" color="white">mdi-arrow-expand</v-icon>
                            </button>
                          </div>
                          <div v-if="att.description" class="att-caption">{{ att.description }}</div>
                        </div>
                        <div v-else-if="att.kind === 'voice'" class="att-voice">
                          <v-icon size="18" class="mr-1">mdi-microphone</v-icon>
                          <audio :src="att.url" controls preload="metadata" @click.stop />
                          <span v-if="att.duration_seconds" class="att-voice-dur">
                            {{ formatDuration(att.duration_seconds) }}
                          </span>
                        </div>
                        <a
                          v-else
                          :href="att.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="att-doc"
                          @click.stop
                        >
                          <v-icon size="22" class="mr-2">mdi-file-document-outline</v-icon>
                          <div class="att-doc-meta">
                            <div class="att-doc-name">{{ att.file_name || "Document" }}</div>
                            <div class="att-doc-size">{{ formatBytes(att.size_bytes) }}</div>
                          </div>
                          <v-icon size="18">mdi-download</v-icon>
                        </a>
                      </template>
                    </div>

                    <div class="message-meta">
                      <span v-if="msg.edited_at" class="edited-flag">(edited)</span>
                      <span class="message-time">{{ formatTime(msg.created_at) }}</span>
                    </div>

                    <!-- Read receipt on my most recent message -->
                    <div
                      v-if="msg.sender_id === meId && msg.id === lastMineId"
                      class="read-receipt"
                    >
                      <v-menu v-if="chatStore.readInfo(msg).count" location="top end">
                        <template #activator="{ props }">
                          <button v-bind="props" class="seen read-receipt-btn" @click.stop>
                            <v-icon size="12">mdi-check-all</v-icon>
                            <template v-if="isGroup || isThread">
                              Seen by {{ chatStore.readInfo(msg).count }}
                            </template>
                            <template v-else>
                              Seen {{ seenTime(chatStore.readersOf(msg)[0] && chatStore.readersOf(msg)[0].at) }}
                            </template>
                          </button>
                        </template>
                        <v-list density="compact">
                          <v-list-subheader>Read by</v-list-subheader>
                          <v-list-item
                            v-for="r in chatStore.readersOf(msg)"
                            :key="r.user_id"
                            @click="chatStore.openProfile(r.user_id)"
                          >
                            <template #prepend>
                              <v-avatar size="26" color="primary" class="mr-1">
                                <span class="text-white" style="font-size: 10px">{{ initials(r.name) }}</span>
                              </v-avatar>
                            </template>
                            <v-list-item-title>{{ r.name }}</v-list-item-title>
                            <v-list-item-subtitle>Seen {{ seenTime(r.at) }}</v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                      <span v-else><v-icon size="12">mdi-check</v-icon> Sent</span>
                    </div>

                    <!-- Reactions -->
                    <div v-if="msg.reactions && msg.reactions.length" class="reactions-row">
                      <button
                        v-for="r in msg.reactions"
                        :key="r.emoji"
                        class="reaction-chip"
                        :class="{ reacted: r.reacted }"
                        @click="quickReact(msg, r.emoji)"
                      >
                        {{ r.emoji }} {{ r.count }}
                      </button>
                    </div>

                    <!-- Thread chip on the root message -->
                    <button
                      v-if="msg.thread_conversation_id"
                      class="thread-chip"
                      @click="openThreadFromMsg(msg)"
                    >
                      <v-icon size="14">mdi-comment-multiple-outline</v-icon>
                      {{ msg.thread_reply_count || 0 }} repl{{ msg.thread_reply_count === 1 ? "y" : "ies" }}
                      <span v-if="msg.thread_title" class="thread-chip-title">· {{ msg.thread_title }}</span>
                    </button>

                    <!-- Hover actions -->
                    <div v-if="!msg.deleted_for_all && !msg.pending" class="msg-actions">
                      <v-menu location="top">
                        <template #activator="{ props }">
                          <v-btn v-bind="props" icon="mdi-emoticon-outline" size="x-small" variant="text" />
                        </template>
                        <div class="emoji-picker">
                          <button
                            v-for="e in REACTION_EMOJIS"
                            :key="e"
                            class="emoji-option"
                            @click="quickReact(msg, e)"
                          >
                            {{ e }}
                          </button>
                        </div>
                      </v-menu>
                      <v-btn icon="mdi-reply" size="x-small" variant="text" @click="onReply(msg)" />
                      <v-menu location="bottom end">
                        <template #activator="{ props }">
                          <v-btn v-bind="props" icon="mdi-dots-vertical" size="x-small" variant="text" />
                        </template>
                        <v-list density="compact">
                          <v-list-item @click="onReply(msg)">
                            <v-list-item-title>Reply</v-list-item-title>
                          </v-list-item>
                          <v-list-item v-if="!msg.thread_conversation_id" @click="replyInThread(msg)">
                            <v-list-item-title>Start thread</v-list-item-title>
                          </v-list-item>
                          <v-list-item v-else @click="openThreadFromMsg(msg)">
                            <v-list-item-title>Open thread</v-list-item-title>
                          </v-list-item>
                          <v-list-item v-if="canEdit(msg)" @click="onEditMessage(msg)">
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item>
                          <v-list-item @click="chatStore.deleteMessage(msg.id, 'me')">
                            <v-list-item-title>Delete for me</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-if="canDeleteEveryone(msg)"
                            @click="chatStore.deleteMessage(msg.id, 'everyone')"
                          >
                            <v-list-item-title class="text-red">Delete for everyone</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                </div>
              </template>

              <div v-if="chatStore.activeTypingLabel" class="typing-row">
                <span class="typing-dots"><i></i><i></i><i></i></span>
                {{ chatStore.activeTypingLabel }}
              </div>
            </div>

            <v-divider />

            <!-- Reply / edit context bar -->
            <div v-if="replyTo || isEditing" class="composer-context">
              <v-icon size="16" class="mr-2">
                {{ isEditing ? "mdi-pencil" : "mdi-reply" }}
              </v-icon>
              <div class="composer-context-body">
                <div class="composer-context-title">
                  {{ isEditing ? "Editing message" : "Replying to " + (replyTo?.sender_name || "") }}
                </div>
                <div class="composer-context-text">
                  {{ isEditing ? editing.content : replyTo?.content }}
                </div>
              </div>
              <v-btn icon="mdi-close" size="x-small" variant="text" @click="cancelComposer" />
            </div>

            <!-- Staged attachments preview -->
            <div
              v-if="stagedAttachments.length || uploading"
              class="staged-bar"
            >
              <div
                v-for="(att, si) in stagedAttachments"
                :key="si"
                class="staged-item"
                :class="{ 'staged-media': att.kind === 'image' || att.kind === 'video' }"
              >
                <div class="staged-row">
                  <img v-if="att.kind === 'image'" :src="att.url" class="staged-thumb" />
                  <video
                    v-else-if="att.kind === 'video'"
                    :src="att.url"
                    class="staged-thumb"
                    muted
                  />
                  <div v-else class="staged-icon">
                    <v-icon size="20">
                      {{
                        att.kind === "voice"
                          ? "mdi-microphone"
                          : "mdi-file-document-outline"
                      }}
                    </v-icon>
                  </div>
                  <span class="staged-name">
                    {{ att.kind === "voice" ? formatDuration(att.duration_seconds) : att.file_name }}
                  </span>
                  <v-btn
                    icon="mdi-close"
                    size="x-small"
                    variant="text"
                    density="compact"
                    @click="chatStore.removeStaged(si)"
                  />
                </div>
                <input
                  v-if="att.kind === 'image' || att.kind === 'video'"
                  v-model="att.description"
                  class="staged-caption"
                  type="text"
                  placeholder="Add a description…"
                />
              </div>
              <div v-for="up in uploadingItems" :key="up.id" class="staged-item uploading-item">
                <div class="staged-icon">
                  <v-progress-circular
                    :model-value="up.percent"
                    size="26"
                    width="3"
                    color="primary"
                  >
                    <span style="font-size: 8px">{{ up.percent }}</span>
                  </v-progress-circular>
                </div>
                <div class="uploading-meta">
                  <span class="staged-name">{{ up.name }}</span>
                  <v-progress-linear
                    :model-value="up.percent"
                    color="primary"
                    height="3"
                    rounded
                  />
                </div>
              </div>
            </div>

            <!-- Recording bar -->
            <div v-if="recording.active" class="recording-bar">
              <span class="rec-dot" />
              <span class="rec-time">Recording {{ formatDuration(recording.seconds) }}</span>
              <v-spacer />
              <v-btn size="small" variant="text" @click="chatStore.cancelRecording()">Cancel</v-btn>
              <v-btn size="small" color="primary" variant="flat" @click="chatStore.stopRecording()">
                <v-icon start size="16">mdi-send</v-icon> Send
              </v-btn>
            </div>

            <footer class="composer">
              <input
                ref="fileInput"
                type="file"
                multiple
                class="d-none"
                @change="onFilesSelected"
              />
              <v-btn
                icon="mdi-paperclip"
                variant="text"
                :disabled="recording.active"
                title="Attach files"
                @click="onPickFiles"
              />
              <v-btn
                :icon="recording.active ? 'mdi-stop' : 'mdi-microphone'"
                variant="text"
                :color="recording.active ? 'red' : undefined"
                title="Voice message"
                @click="recording.active ? chatStore.stopRecording() : chatStore.startRecording()"
              />
              <div class="composer-input-wrap">
                <!-- Mention dropdown -->
                <div v-if="mentionMenu.open && mentionMatches.length" class="mention-menu">
                  <button
                    v-for="(c, ci) in mentionMatches"
                    :key="c.user_id"
                    class="mention-option"
                    :class="{ active: ci === mentionMenu.active }"
                    @mousedown.prevent="pickMention(c)"
                    @mouseenter="mentionMenu.active = ci"
                  >
                    <v-avatar size="24" color="primary" class="mr-2">
                      <span class="text-white" style="font-size: 10px">{{ initials(c.name) }}</span>
                    </v-avatar>
                    {{ c.name }}
                  </button>
                </div>
                <v-textarea
                  v-model="draft"
                  rows="1"
                  auto-grow
                  max-rows="5"
                  density="compact"
                  variant="outlined"
                  hide-details
                  :placeholder="isEditing ? 'Edit your message…' : 'Type a message…  (@ to mention)'"
                  @input="onComposerInput"
                  @keydown="onComposerKeydown"
                />
              </div>
              <v-btn
                v-if="isEditing"
                icon="mdi-close"
                variant="text"
                class="ml-2"
                @click="cancelComposer"
              />
              <v-btn
                :icon="isEditing ? 'mdi-check' : 'mdi-send'"
                color="primary"
                :loading="sending"
                :disabled="!draft.trim() && !stagedAttachments.length"
                class="ml-2"
                @click="onSubmit"
              />
            </footer>
          </template>

          <div v-else class="empty-thread">
            <v-icon size="64" color="grey-lighten-1">mdi-chat-outline</v-icon>
            <p class="text-medium-emphasis mt-2">Select a conversation or start a new one</p>
          </div>
        </section>
      </div>
    </v-card>

    <!-- New direct chat -->
    <v-dialog v-model="userPicker.open" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Start a new chat</span>
          <v-btn icon="mdi-close" variant="text" @click="userPicker.open = false" />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="userPicker.search"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="Search users by name or email"
            prepend-inner-icon="mdi-magnify"
            class="mb-3"
          />
          <v-progress-linear v-if="userPicker.loading" indeterminate color="primary" />
          <v-list>
            <v-list-item
              v-for="user in userPicker.data"
              :key="user.id"
              @click="pickUser(user.id)"
            >
              <template #prepend>
                <v-avatar size="38" color="primary">
                  <v-img v-if="user.profile_image_url" :src="user.profile_image_url" />
                  <span v-else class="text-white text-caption">{{ initials(user.name) }}</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
            <div
              v-if="!userPicker.loading && !userPicker.data.length"
              class="text-center pa-4 text-medium-emphasis text-body-2"
            >
              No users found
            </div>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- New group -->
    <v-dialog v-model="groupPicker.open" max-width="520">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>New group</span>
          <v-btn icon="mdi-close" variant="text" @click="groupPicker.open = false" />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="groupPicker.title"
            density="compact"
            variant="outlined"
            label="Group name"
            hide-details
            class="mb-3"
          />
          <v-text-field
            v-model="groupPicker.search"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="Search users to add"
            prepend-inner-icon="mdi-magnify"
            class="mb-2"
          />
          <div class="text-caption text-medium-emphasis mb-1">
            {{ groupPicker.selected.length }} selected
          </div>
          <v-progress-linear v-if="groupPicker.loading" indeterminate color="primary" />
          <v-list class="picker-list">
            <v-list-item
              v-for="user in groupPicker.data"
              :key="user.id"
              @click="chatStore.toggleGroupMember(user.id)"
            >
              <template #prepend>
                <v-checkbox-btn
                  :model-value="groupPicker.selected.includes(user.id)"
                  color="primary"
                />
              </template>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="groupPicker.open = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="groupPicker.creating"
            :disabled="!groupPicker.title.trim() || !groupPicker.selected.length"
            @click="chatStore.createGroup()"
          >
            Create group
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Members management -->
    <v-dialog v-model="membersPanel.open" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ active?.title }} · Members</span>
          <v-btn icon="mdi-close" variant="text" @click="membersPanel.open = false" />
        </v-card-title>
        <v-card-text>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-caption text-medium-emphasis">
              {{ membersPanel.data.length }} members
            </span>
            <v-btn
              v-if="myRole === 'owner' || myRole === 'admin'"
              size="small"
              variant="tonal"
              color="primary"
              prepend-icon="mdi-account-plus"
              @click="openAddMember"
            >
              Add
            </v-btn>
          </div>
          <v-progress-linear v-if="membersPanel.loading" indeterminate color="primary" />
          <v-list>
            <v-list-item v-for="m in membersPanel.data" :key="m.user_id">
              <template #prepend>
                <div class="avatar-wrap mr-2">
                  <v-avatar size="38" color="primary">
                    <v-img v-if="m.profile_image_url" :src="m.profile_image_url" />
                    <span v-else class="text-white text-caption">{{ initials(m.name) }}</span>
                  </v-avatar>
                  <span
                    class="presence-dot"
                    :class="chatStore.isOnline(m.user_id) ? 'is-online' : 'is-offline'"
                  />
                </div>
              </template>
              <v-list-item-title class="d-flex align-center gap-1">
                {{ m.name }}
                <span v-if="m.user_id === meId" class="text-caption text-medium-emphasis">(you)</span>
              </v-list-item-title>
              <v-list-item-subtitle>{{ m.email }}</v-list-item-subtitle>
              <template #append>
                <v-chip :color="roleColor(m.role)" size="x-small" variant="flat" class="mr-1">
                  {{ m.role }}
                </v-chip>
                <v-menu v-if="canActOn(m)" location="bottom end">
                  <template #activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-dots-vertical" size="x-small" variant="text" />
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      v-if="myRole === 'owner' && m.role === 'member'"
                      @click="chatStore.setMemberRole(m.user_id, 'admin')"
                    >
                      <v-list-item-title>Make admin</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="myRole === 'owner' && m.role === 'admin'"
                      @click="chatStore.setMemberRole(m.user_id, 'member')"
                    >
                      <v-list-item-title>Revoke admin</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="myRole === 'owner'" @click="doTransfer(m)">
                      <v-list-item-title>Transfer ownership</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="canRemove(m)" @click="chatStore.removeMember(m.user_id)">
                      <v-list-item-title class="text-red">Remove from group</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="chatStore.openProfile(m.user_id)">
                      <v-list-item-title>View profile</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <v-btn
                  v-else
                  icon="mdi-account-details"
                  size="x-small"
                  variant="text"
                  @click="chatStore.openProfile(m.user_id)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" variant="text" prepend-icon="mdi-exit-to-app" @click="doLeave">
            Leave group
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="membersPanel.open = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add member sub-picker -->
    <v-dialog v-model="addMemberPicker.open" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Add members</span>
          <v-btn icon="mdi-close" variant="text" @click="addMemberPicker.open = false" />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="addMemberPicker.search"
            density="compact"
            variant="outlined"
            hide-details
            placeholder="Search users"
            prepend-inner-icon="mdi-magnify"
            class="mb-3"
          />
          <v-progress-linear v-if="addMemberPicker.loading" indeterminate color="primary" />
          <v-list>
            <v-list-item
              v-for="user in addMemberPicker.data"
              :key="user.id"
              @click="chatStore.addMembers([user.id])"
            >
              <template #prepend>
                <v-avatar size="36" color="primary">
                  <v-img v-if="user.profile_image_url" :src="user.profile_image_url" />
                  <span v-else class="text-white text-caption">{{ initials(user.name) }}</span>
                </v-avatar>
              </template>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
            <div
              v-if="!addMemberPicker.loading && !addMemberPicker.data.length"
              class="text-center pa-4 text-medium-emphasis text-body-2"
            >
              No users found
            </div>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Profile card -->
    <v-dialog v-model="profilePanel.open" max-width="420">
      <v-card rounded="lg">
        <v-card-text class="text-center pt-6">
          <v-progress-circular v-if="profilePanel.loading" indeterminate color="primary" />
          <template v-else-if="profilePanel.data">
            <div class="avatar-wrap d-inline-flex mb-3">
              <v-avatar size="80" color="primary">
                <v-img
                  v-if="profilePanel.data.profile_image_url"
                  :src="profilePanel.data.profile_image_url"
                />
                <span v-else class="text-white text-h5">{{ initials(profilePanel.data.name) }}</span>
              </v-avatar>
              <span
                class="presence-dot presence-dot-lg"
                :class="chatStore.isOnline(profilePanel.data.id) ? 'is-online' : 'is-offline'"
              />
            </div>
            <div class="text-h6">{{ profilePanel.data.name }}</div>
            <div class="text-caption" :class="chatStore.isOnline(profilePanel.data.id) ? 'text-green' : 'text-medium-emphasis'">
              {{ chatStore.isOnline(profilePanel.data.id) ? "Online" : "Offline" }}
            </div>

            <v-list class="text-left mt-3" density="compact">
              <v-list-item prepend-icon="mdi-email-outline">
                <v-list-item-title>{{ profilePanel.data.email || "—" }}</v-list-item-title>
                <v-list-item-subtitle>Email</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-phone-outline">
                <v-list-item-title>{{ profilePanel.data.phone_number || "—" }}</v-list-item-title>
                <v-list-item-subtitle>Phone</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-check-circle-outline">
                <v-list-item-title>
                  {{ profilePanel.data.status === 1 ? "Active" : "Inactive" }}
                </v-list-item-title>
                <v-list-item-subtitle>Status</v-list-item-subtitle>
              </v-list-item>
              <v-list-item prepend-icon="mdi-shield-account-outline">
                <v-list-item-title>
                  <span v-if="profilePanel.data.roles && profilePanel.data.roles.length">
                    <v-chip
                      v-for="r in profilePanel.data.roles"
                      :key="r"
                      size="x-small"
                      class="mr-1"
                      variant="tonal"
                    >
                      {{ r }}
                    </v-chip>
                  </span>
                  <span v-else>—</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  Role<span v-if="profilePanel.data.conversation_role">
                    · {{ profilePanel.data.conversation_role }} in this group</span
                  >
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="profilePanel.data && profilePanel.data.id !== meId"
            color="primary"
            variant="flat"
            prepend-icon="mdi-message-text"
            @click="chatStore.messageUser(profilePanel.data.id)"
          >
            Message
          </v-btn>
          <v-spacer />
          <v-btn variant="text" @click="profilePanel.open = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit group / thread (tabbed: Details / Info) -->
    <v-dialog v-model="editDialog.open" max-width="460">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>{{ isThread ? "Thread" : "Group" }}</span>
          <v-btn icon="mdi-close" variant="text" @click="editDialog.open = false" />
        </v-card-title>
        <v-tabs v-model="editDialog.tab" density="compact" color="primary">
          <v-tab value="details">Details</v-tab>
          <v-tab value="info">Info</v-tab>
        </v-tabs>
        <v-divider />

        <!-- Details tab -->
        <template v-if="editDialog.tab === 'details'">
          <v-card-text>
            <v-text-field
              v-model="editDialog.title"
              label="Name"
              density="compact"
              variant="outlined"
              :readonly="!canEditConv"
              hide-details
              class="mb-3"
            />
            <v-textarea
              v-model="editDialog.description"
              label="Description"
              rows="3"
              auto-grow
              density="compact"
              variant="outlined"
              :readonly="!canEditConv"
              hide-details
              placeholder="Add a description / topic…"
            />
            <div v-if="!canEditConv" class="text-caption text-medium-emphasis mt-2">
              Only owners and admins can edit.
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="editDialog.open = false">Cancel</v-btn>
            <v-btn
              v-if="canEditConv"
              color="primary"
              variant="flat"
              :disabled="!editDialog.title.trim()"
              @click="saveConvEdit"
            >
              Save
            </v-btn>
          </v-card-actions>
        </template>

        <!-- Info tab (members) -->
        <template v-else>
          <v-card-text style="max-height: 55vh; overflow-y: auto">
            <div class="d-flex justify-space-between align-center mb-1">
              <span class="text-caption text-medium-emphasis">
                {{ membersPanel.data.length }} members
              </span>
              <v-btn
                v-if="isGroup && canEditConv"
                size="small"
                variant="text"
                color="primary"
                prepend-icon="mdi-cog"
                @click="editDialog.open = false; chatStore.openMembers()"
              >
                Manage
              </v-btn>
            </div>
            <v-list>
              <v-list-item
                v-for="m in membersPanel.data"
                :key="m.user_id"
                @click="chatStore.openProfile(m.user_id)"
              >
                <template #prepend>
                  <div class="avatar-wrap mr-2">
                    <v-avatar size="34" color="primary">
                      <v-img v-if="m.profile_image_url" :src="m.profile_image_url" />
                      <span v-else class="text-white text-caption">{{ initials(m.name) }}</span>
                    </v-avatar>
                    <span
                      class="presence-dot"
                      :class="chatStore.isOnline(m.user_id) ? 'is-online' : 'is-offline'"
                    />
                  </div>
                </template>
                <v-list-item-title>{{ m.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ m.email }}</v-list-item-subtitle>
                <template #append>
                  <v-chip :color="roleColor(m.role)" size="x-small" variant="flat">{{ m.role }}</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </template>
      </v-card>
    </v-dialog>

    <!-- Threads & group info -->
    <v-dialog v-model="threadsPanel.open" max-width="480">
      <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Threads &amp; info</span>
          <v-btn icon="mdi-close" variant="text" @click="threadsPanel.open = false" />
        </v-card-title>
        <v-tabs v-model="threadsPanel.tab" density="compact" color="primary">
          <v-tab value="threads">Threads</v-tab>
          <v-tab value="info">{{ isGroup || isThread ? "Group info" : "Info" }}</v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text style="max-height: 60vh; overflow-y: auto">
          <!-- Threads tab -->
          <div v-if="threadsPanel.tab === 'threads'">
            <v-progress-linear v-if="threadsPanel.loading" indeterminate color="primary" />
            <v-list v-if="threadsPanel.data.length">
              <v-list-item
                v-for="t in threadsPanel.data"
                :key="t.conversation_id"
                @click="chatStore.openThread(t.conversation_id)"
              >
                <template #prepend>
                  <v-avatar size="34" color="deep-purple">
                    <v-icon color="white" size="18">mdi-comment-multiple-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ t.title || "Thread" }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ t.reply_count }} repl{{ t.reply_count === 1 ? "y" : "ies" }}
                  <span v-if="t.root_snippet">· {{ t.root_snippet }}</span>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <div
              v-else-if="!threadsPanel.loading"
              class="text-center pa-6 text-medium-emphasis text-body-2"
            >
              No threads yet. Open a message's menu → "Start thread".
            </div>
          </div>

          <!-- Info tab -->
          <div v-else>
            <template v-if="isGroup || isThread">
              <div class="text-caption text-medium-emphasis mb-2">
                {{ membersPanel.data.length }} members
              </div>
              <v-list>
                <v-list-item v-for="m in membersPanel.data" :key="m.user_id">
                  <template #prepend>
                    <div class="avatar-wrap mr-2">
                      <v-avatar size="34" color="primary">
                        <v-img v-if="m.profile_image_url" :src="m.profile_image_url" />
                        <span v-else class="text-white text-caption">{{ initials(m.name) }}</span>
                      </v-avatar>
                      <span
                        class="presence-dot"
                        :class="chatStore.isOnline(m.user_id) ? 'is-online' : 'is-offline'"
                      />
                    </div>
                  </template>
                  <v-list-item-title>{{ m.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ m.email }}</v-list-item-subtitle>
                  <template #append>
                    <v-chip :color="roleColor(m.role)" size="x-small" variant="flat">{{ m.role }}</v-chip>
                  </template>
                </v-list-item>
              </v-list>
              <v-btn
                v-if="isGroup"
                block
                variant="tonal"
                color="primary"
                class="mt-2"
                @click="threadsPanel.open = false; chatStore.openMembers()"
              >
                Manage members
              </v-btn>
            </template>
            <div v-else class="text-center pa-4">
              <v-btn
                v-if="active?.other_user_id"
                variant="tonal"
                color="primary"
                @click="threadsPanel.open = false; chatStore.openProfile(active.other_user_id)"
              >
                View profile
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Media lightbox gallery -->
    <v-dialog v-model="lightbox.open" max-width="94vw" @click:outside="lightbox.open = false">
      <div v-if="lightboxCurrent" class="lightbox">
        <div class="lightbox-bar">
          <span class="lightbox-name">
            {{ lightboxCurrent.file_name }}
            <span v-if="lightbox.items.length > 1" class="lightbox-count">
              ({{ lightbox.index + 1 }}/{{ lightbox.items.length }})
            </span>
          </span>
          <v-spacer />
          <v-btn
            icon="mdi-open-in-new"
            variant="text"
            color="white"
            size="small"
            :href="lightboxCurrent.url"
            target="_blank"
            rel="noopener noreferrer"
          />
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            size="small"
            @click="lightbox.open = false"
          />
        </div>

        <div class="lightbox-stage">
          <v-btn
            v-if="lightbox.items.length > 1"
            icon="mdi-chevron-left"
            variant="text"
            color="white"
            class="lightbox-nav prev"
            :disabled="lightbox.index === 0"
            @click.stop="lightboxPrev"
          />
          <img
            v-if="lightboxCurrent.kind === 'image'"
            :src="lightboxCurrent.url"
            class="lightbox-media"
            @click.stop
          />
          <video
            v-else
            :key="lightboxCurrent.url"
            :src="lightboxCurrent.url"
            controls
            autoplay
            class="lightbox-media"
            @click.stop
          />
          <v-btn
            v-if="lightbox.items.length > 1"
            icon="mdi-chevron-right"
            variant="text"
            color="white"
            class="lightbox-nav next"
            :disabled="lightbox.index === lightbox.items.length - 1"
            @click.stop="lightboxNext"
          />
        </div>

        <div v-if="lightboxCurrent.description" class="lightbox-caption">
          {{ lightboxCurrent.description }}
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped>
.chat-shell {
  overflow: hidden;
}
.chat-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: calc(100vh - 140px);
  min-height: 480px;
}
.chat-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  min-width: 0;
  min-height: 0;
}
.conversation-scroll {
  flex: 1;
  overflow-y: auto;
}
.conversation-item {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: background 0.15s ease;
}
.conversation-item:hover {
  background: rgba(0, 0, 0, 0.03);
}
.conversation-item.active {
  background: rgba(var(--v-theme-primary), 0.1);
}
.conversation-meta {
  flex: 1;
  min-width: 0;
}
.conversation-name {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.conversation-time {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.5);
  flex-shrink: 0;
  margin-left: 8px;
}
.conversation-preview {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.chat-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}
.header-id {
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 0;
}
.messages-panel {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  /* extra top room so a hovered message's action bar (which sits above the
     bubble) is never clipped for the first row */
  padding: 28px 16px 16px;
  background: rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.day-separator {
  position: sticky;
  top: 4px;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin: 6px 0;
  flex-shrink: 0;
  pointer-events: none;
}
.day-chip {
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
}
.message-row {
  display: flex;
  justify-content: flex-start;
  flex-shrink: 0;
}
.message-row.mine {
  justify-content: flex-end;
}
.message-bubble {
  position: relative;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}
.message-row.mine .message-bubble {
  background: rgb(var(--v-theme-primary));
  color: #fff;
}
.message-bubble.pending {
  opacity: 0.6;
}
.message-bubble.ai {
  max-width: 88%;
  border: 1px solid rgba(103, 58, 183, 0.25);
}

/* Markdown (AI assistant) */
.markdown-body {
  font-size: 0.9rem;
  line-height: 1.5;
}
.markdown-body :deep(p) {
  margin: 0 0 8px;
}
.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  font-weight: 700;
  line-height: 1.25;
  margin: 10px 0 6px;
}
.markdown-body :deep(h1) {
  font-size: 1.15rem;
}
.markdown-body :deep(h2) {
  font-size: 1.05rem;
}
.markdown-body :deep(h3) {
  font-size: 0.98rem;
}
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 4px 0 8px;
  padding-left: 20px;
}
.markdown-body :deep(li) {
  margin: 2px 0;
}
.markdown-body :deep(a) {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  word-break: break-word;
}
.markdown-body :deep(code) {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.82em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.markdown-body :deep(pre) {
  background: #1e1e2e;
  color: #e4e4e7;
  border-radius: 8px;
  padding: 10px 12px;
  overflow-x: auto;
  margin: 6px 0;
}
.markdown-body :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 0.8rem;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid rgba(103, 58, 183, 0.5);
  margin: 6px 0;
  padding: 2px 10px;
  color: rgba(0, 0, 0, 0.65);
}
.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 6px 0;
  font-size: 0.82rem;
  display: block;
  overflow-x: auto;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding: 4px 8px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: rgba(0, 0, 0, 0.05);
  font-weight: 700;
}
.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 8px 0;
}
.message-bubble.deleted {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.5);
}
.message-sender {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 2px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: block;
  text-align: left;
}
.message-sender:hover {
  text-decoration: underline;
}
.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.9rem;
}
.deleted-text {
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 4px;
}
.message-time {
  font-size: 0.65rem;
  opacity: 0.7;
  text-align: right;
  margin-top: 2px;
}
.msg-menu-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.message-bubble:hover .msg-menu-btn {
  opacity: 0.7;
}
.typing-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.55);
  padding: 2px 4px;
  flex-shrink: 0;
}
.typing-dots {
  display: inline-flex;
  gap: 2px;
}
.typing-dots i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  animation: typing-bounce 1.2s infinite ease-in-out;
}
.typing-dots i:nth-child(2) {
  animation-delay: 0.15s;
}
.typing-dots i:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
.composer {
  display: flex;
  align-items: flex-end;
  padding: 12px 16px;
}
.empty-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.picker-list {
  max-height: 320px;
  overflow-y: auto;
}
.gap-2 {
  gap: 8px;
}
.gap-1 {
  gap: 4px;
}
.avatar-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.presence-dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-sizing: border-box;
}
.presence-dot-lg {
  width: 18px;
  height: 18px;
  right: 2px;
  bottom: 2px;
}
.presence-dot.is-online {
  background: #22c55e;
}
.presence-dot.is-offline {
  background: #9ca3af;
}
.status-text {
  font-weight: 600;
}
.history-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 0 10px;
  flex-shrink: 0;
}

/* System messages */
.system-row {
  display: flex;
  justify-content: center;
  margin: 4px 0;
  flex-shrink: 0;
}
.system-chip {
  font-size: 0.72rem;
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.05);
  padding: 3px 10px;
  border-radius: 10px;
}

/* Reply quote inside a bubble */
.reply-quote {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.7);
  padding: 2px 8px;
  margin-bottom: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  max-width: 100%;
}
.message-row.mine .reply-quote {
  background: rgba(255, 255, 255, 0.18);
  border-left-color: rgba(255, 255, 255, 0.8);
}
.reply-quote-name {
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0.9;
}
.reply-quote-text {
  font-size: 0.75rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 240px;
}

/* @mention highlight */
.mention {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  background: rgba(var(--v-theme-primary), 0.12);
  border-radius: 4px;
  padding: 0 2px;
}
.message-row.mine .mention {
  color: #fff;
  background: rgba(255, 255, 255, 0.25);
}

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
}
.edited-flag {
  font-size: 0.62rem;
  opacity: 0.6;
  font-style: italic;
}

/* Reactions */
.reactions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.reaction-chip {
  font-size: 0.72rem;
  line-height: 1;
  padding: 3px 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid transparent;
  cursor: pointer;
}
.message-row.mine .reaction-chip {
  background: rgba(255, 255, 255, 0.2);
}
.reaction-chip.reacted {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.15);
}

/* Thread chip */
.thread-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 5px;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
  padding: 3px 8px;
  border-radius: 10px;
  cursor: pointer;
  max-width: 100%;
}
.message-row.mine .thread-chip {
  color: #fff;
  background: rgba(255, 255, 255, 0.22);
}
.thread-chip-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

/* Message hover actions */
.msg-actions {
  position: absolute;
  /* Sit fully ABOVE the bubble so it never covers the message text. */
  top: -26px;
  display: flex;
  gap: 0;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  opacity: 0;
  transition: opacity 0.12s ease;
  z-index: 3;
  white-space: nowrap;
}
/* Others' bubbles are left-aligned → grow the toolbar rightward (free space),
   so narrow bubbles don't push it off the left edge. */
.message-row:not(.mine) .msg-actions {
  left: 0;
  right: auto;
}
/* My bubbles are right-aligned → grow the toolbar leftward (free space). */
.message-row.mine .msg-actions {
  right: 0;
  left: auto;
}
.msg-actions .v-btn {
  color: rgba(0, 0, 0, 0.7) !important;
}
.message-bubble:hover .msg-actions {
  opacity: 1;
}
.read-receipt-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
}

/* Links inside messages */
.msg-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
  word-break: break-all;
}
.message-row.mine .msg-link {
  color: #fff;
}
.mention.clickable {
  cursor: pointer;
}

/* Read receipts */
.read-receipt {
  font-size: 0.62rem;
  opacity: 0.75;
  text-align: right;
  margin-top: 2px;
}
.read-receipt .seen {
  color: #38bdf8;
  font-weight: 600;
}
.message-row.mine .read-receipt .seen {
  color: #bae6fd;
}
.read-receipt .v-icon {
  vertical-align: -1px;
}
.mention-option.active {
  background: rgba(var(--v-theme-primary), 0.12);
}
.emoji-picker {
  display: flex;
  gap: 2px;
  padding: 6px 8px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.emoji-option {
  font-size: 1.15rem;
  line-height: 1;
  padding: 2px 4px;
  cursor: pointer;
  border-radius: 6px;
}
.emoji-option:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: scale(1.2);
}

/* Composer context (reply/edit) */
.composer-context {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(var(--v-theme-primary), 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.composer-context-body {
  flex: 1;
  min-width: 0;
}
.composer-context-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}
.composer-context-text {
  font-size: 0.78rem;
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mention dropdown */
.composer-input-wrap {
  position: relative;
  flex: 1;
}
.mention-menu {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 5;
  max-height: 220px;
  overflow-y: auto;
}
.mention-option {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
}
.mention-option:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}

/* Attachments in messages */
.attachments {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 0;
}
.att-image {
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: block;
}
.att-image img {
  max-width: 240px;
  max-height: 260px;
  border-radius: 8px;
  display: block;
}
.att-media {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.att-video-wrap {
  position: relative;
  display: inline-block;
}
.att-video {
  max-width: 260px;
  max-height: 280px;
  border-radius: 8px;
  background: #000;
  display: block;
}
.att-expand {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
  border: none;
  line-height: 0;
}
.att-caption {
  font-size: 0.8rem;
  opacity: 0.85;
  white-space: pre-wrap;
  word-break: break-word;
  max-width: 260px;
}
.att-voice {
  display: flex;
  align-items: center;
  gap: 4px;
}
.att-voice audio {
  height: 34px;
  max-width: 210px;
}
.att-voice-dur {
  font-size: 0.7rem;
  opacity: 0.7;
}
.att-doc {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
  text-decoration: none;
  color: inherit;
  max-width: 260px;
}
.message-row.mine .att-doc {
  background: rgba(255, 255, 255, 0.2);
}
.att-doc-meta {
  flex: 1;
  min-width: 0;
}
.att-doc-name {
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.att-doc-size {
  font-size: 0.68rem;
  opacity: 0.7;
}

/* Staged attachment preview bar */
.staged-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.staged-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 2px 4px 2px 6px;
  max-width: 200px;
}
.staged-item.staged-media {
  flex-direction: column;
  align-items: stretch;
  padding: 4px;
  width: 190px;
}
.staged-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.staged-caption {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  padding: 3px 6px;
  font-size: 0.72rem;
  margin-top: 3px;
  width: 100%;
  background: #fff;
  outline: none;
}
.staged-caption:focus {
  border-color: rgb(var(--v-theme-primary));
}
video.staged-thumb {
  object-fit: cover;
}
.staged-thumb {
  width: 34px;
  height: 34px;
  object-fit: cover;
  border-radius: 6px;
}
.staged-icon {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.staged-name {
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 110px;
}
.uploading-item {
  min-width: 150px;
}
.uploading-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
}

/* Media lightbox gallery */
.lightbox {
  background: rgba(0, 0, 0, 0.92);
  border-radius: 8px;
  overflow: hidden;
}
.lightbox-bar {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  color: #fff;
}
.lightbox-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lightbox-count {
  opacity: 0.6;
}
.lightbox-stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-media {
  display: block;
  max-width: 90vw;
  max-height: 78vh;
  margin: 0 auto;
  object-fit: contain;
}
.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4) !important;
  z-index: 2;
}
.lightbox-nav.prev {
  left: 8px;
}
.lightbox-nav.next {
  right: 8px;
}
.lightbox-caption {
  color: #fff;
  padding: 8px 14px 12px;
  font-size: 0.85rem;
  text-align: center;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Recording bar */
.recording-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(244, 67, 54, 0.08);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
.rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f44336;
  animation: rec-pulse 1s infinite;
}
.rec-time {
  font-size: 0.85rem;
  font-weight: 600;
}
@keyframes rec-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.mobile-only {
  display: none !important;
}
@media (max-width: 767px) {
  .chat-grid {
    grid-template-columns: 1fr;
    height: calc(100vh - 96px);
    min-height: 0;
  }
  .chat-sidebar {
    border-right: none;
  }
  .chat-sidebar.pane-hidden-mobile,
  .chat-main.pane-hidden-mobile {
    display: none;
  }
  .mobile-only {
    display: inline-flex !important;
  }
  .conversation-preview {
    max-width: 60vw;
  }
  .message-bubble {
    max-width: 85%;
  }
}
</style>
