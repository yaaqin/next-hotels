export interface ChatApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ChatUser {
  id: string
  username: string | null
  name: string | null
  avatarUrl: string | null
}

export interface ChatMe extends ChatUser {
  email: string
  usernameSetAt: string | null
  hasUsername: boolean
}

export type UsernameIssue = 'LENGTH' | 'FORMAT' | 'RESERVED' | 'TAKEN'

export interface UsernameCheck {
  username: string
  available: boolean
  reason: UsernameIssue | null
  message: string | null
}

export interface ChatConversation {
  id: string
  peer: ChatUser | null
  // Read receipt: pesan saya sudah dibaca kalau createdAt <= peerLastReadAt
  peerLastReadAt: string | null
  lastMessageAt: string | null
  lastMessagePreview: string | null
  lastMessageSenderId: string | null
  unreadCount: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  type: 'TEXT' | 'CONTEXT' | 'SYSTEM'
  content: string
  isDeleted: boolean
  clientId: string | null
  createdAt: string
  // Khusus FE: pesan optimistis yang belum / gagal terkirim
  pending?: boolean
  failed?: boolean
}

export interface ChatMessagePage {
  messages: ChatMessage[]
  hasMore: boolean
}

// Event socket namespace /chat
export interface ChatMessageEvent {
  conversationId: string
  message: ChatMessage
}

export interface ChatReadEvent {
  conversationId: string
  userId: string
  lastReadAt: string
}
