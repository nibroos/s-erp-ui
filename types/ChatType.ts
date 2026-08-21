export type ConversationType = {
  id: number
  type: string // 'direct' | 'group'
  title?: string | null
  last_message_at?: string | null
  last_message_text?: string | null
  unread_count: number
  other_user_id?: number | null
  other_user_name?: string | null
  other_user_email?: string | null
  other_user_image?: string | null
  other_user_is_ai?: boolean
  online?: boolean
  description?: string | null
  other_user_last_read?: number | null
  other_user_last_read_at?: string | null
  // group metadata
  my_role?: string // 'owner' | 'admin' | 'member'
  member_count?: number
  // thread metadata (set for threads)
  parent_id?: number | null
}

export type ReplyPreviewType = {
  id: number
  sender_name?: string | null
  content: string
  deleted_for_all?: boolean
}

export type MentionType = {
  user_id: number
  name: string
}

export type ReactionGroupType = {
  emoji: string
  count: number
  user_ids: number[]
  reacted?: boolean
}

export type AttachmentType = {
  id?: number
  kind: string // 'image' | 'video' | 'voice' | 'document'
  object_key?: string
  file_name?: string | null
  mime_type?: string | null
  size_bytes?: number | null
  duration_seconds?: number | null
  width?: number | null
  height?: number | null
  description?: string | null
  url: string
}

export type MessageType = {
  id: number
  conversation_id: number
  sender_id: number
  sender_name?: string | null
  sender_is_ai?: boolean
  content: string
  type?: string // 'text' | 'system'
  deleted_for_all?: boolean
  edited_at?: string | null
  reply_to_id?: number | null
  created_at?: string | null
  reply_to?: ReplyPreviewType | null
  mentions?: MentionType[]
  reactions?: ReactionGroupType[]
  attachments?: AttachmentType[]
  thread_conversation_id?: number | null
  thread_reply_count?: number
  thread_title?: string | null
  // client-only flag for optimistic messages awaiting server confirmation
  pending?: boolean
}

export type ThreadType = {
  conversation_id: number
  title?: string | null
  root_message_id?: number | null
  root_snippet?: string | null
  reply_count: number
  last_message_at?: string | null
}

export type ChatUserType = {
  id: number
  name: string
  email: string
  profile_image_url?: string | null
}

export type MemberType = {
  user_id: number
  name: string
  email: string
  phone_number?: string | null
  profile_image_url?: string | null
  role: string // 'owner' | 'admin' | 'member'
  is_ai?: boolean
  last_read_message_id?: number | null
  last_read_at?: string | null
  online?: boolean
}

export type ProfileType = {
  id: number
  name: string
  email: string
  status?: number | null
  phone_number?: string | null
  address?: string | null
  profile_image_url?: string | null
  is_ai?: boolean
  roles?: string[]
  conversation_role?: string | null
  online?: boolean
}

// Envelope pushed by the server over the websocket.
export type WSEnvelope = {
  type:
    | 'message'
    | 'read'
    | 'typing'
    | 'error'
    | 'ping'
    | 'presence'
    | 'presence_snapshot'
    | 'message_deleted'
    | 'message_edited'
    | 'reaction_updated'
    | 'thread_created'
    | 'conversation_updated'
  payload?: any
}
