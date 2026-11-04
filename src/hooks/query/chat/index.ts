import { InfiniteData, QueryClient, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  checkChatUsername,
  getChatConversations,
  getChatMe,
  getChatMessages,
  searchChatUsers,
} from '@/src/services/chat'
import type { ChatConversation, ChatMessage, ChatMessagePage } from '@/src/models/chat'

export const chatKeys = {
  me: ['chat', 'me'] as const,
  conversations: ['chat', 'conversations'] as const,
  messages: (conversationId: string) => ['chat', 'messages', conversationId] as const,
  search: (q: string) => ['chat', 'search', q] as const,
  usernameCheck: (u: string) => ['chat', 'username-check', u] as const,
}

export const useChatMe = (enabled: boolean) =>
  useQuery({ queryKey: chatKeys.me, queryFn: getChatMe, enabled, staleTime: 60_000 })

export const useUsernameCheck = (username: string) =>
  useQuery({
    queryKey: chatKeys.usernameCheck(username),
    queryFn: () => checkChatUsername(username),
    enabled: username.length > 0,
    staleTime: 10_000,
  })

export const useChatUserSearch = (q: string) =>
  useQuery({
    queryKey: chatKeys.search(q),
    queryFn: () => searchChatUsers(q),
    enabled: q.replace(/^@/, '').length >= 2,
    staleTime: 10_000,
  })

export const useChatConversations = (enabled: boolean) =>
  useQuery({ queryKey: chatKeys.conversations, queryFn: getChatConversations, enabled })

// Halaman pertama = pesan terbaru; halaman berikutnya makin lama (cursor = id pesan tertua)
export const useChatMessages = (conversationId: string | null) =>
  useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId ?? ''),
    queryFn: ({ pageParam }) => getChatMessages(conversationId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.messages[0]?.id : undefined),
    enabled: !!conversationId,
  })

// ─── Helper cache (dipakai socket & optimistic send) ─────────────────────────

const sameMessage = (a: ChatMessage, b: ChatMessage) =>
  a.id === b.id || (!!a.clientId && a.clientId === b.clientId)

// Masukkan / ganti pesan di halaman terbaru; pesan optimistis diganti versi server lewat clientId
export function upsertMessage(qc: QueryClient, conversationId: string, message: ChatMessage) {
  qc.setQueryData<InfiniteData<ChatMessagePage, string | undefined>>(chatKeys.messages(conversationId), (data) => {
    if (!data) return data
    const exists = data.pages.some((p) => p.messages.some((m) => sameMessage(m, message)))
    const pages = data.pages.map((page, i) => {
      if (exists) return { ...page, messages: page.messages.map((m) => (sameMessage(m, message) ? message : m)) }
      return i === 0 ? { ...page, messages: [...page.messages, message] } : page
    })
    return { ...data, pages }
  })
}

export function updateMessage(
  qc: QueryClient,
  conversationId: string,
  clientId: string,
  patch: Partial<ChatMessage>,
) {
  qc.setQueryData<InfiniteData<ChatMessagePage, string | undefined>>(chatKeys.messages(conversationId), (data) =>
    data
      ? {
        ...data,
        pages: data.pages.map((p) => ({
          ...p,
          messages: p.messages.map((m) => (m.clientId === clientId ? { ...m, ...patch } : m)),
        })),
      }
      : data,
  )
}

// Update ringkasan di daftar percakapan + pindahkan ke paling atas
export function bumpConversation(
  qc: QueryClient,
  conversationId: string,
  message: ChatMessage,
  opts: { incrementUnread: boolean },
): boolean {
  let found = false
  qc.setQueryData<ChatConversation[]>(chatKeys.conversations, (list) => {
    if (!list) return list
    const current = list.find((c) => c.id === conversationId)
    if (!current) return list
    found = true
    const updated: ChatConversation = {
      ...current,
      lastMessageAt: message.createdAt,
      lastMessagePreview: message.content.replace(/\s+/g, ' ').slice(0, 140),
      lastMessageSenderId: message.senderId,
      unreadCount: opts.incrementUnread ? current.unreadCount + 1 : current.unreadCount,
    }
    return [updated, ...list.filter((c) => c.id !== conversationId)]
  })
  return found
}

export function patchConversation(qc: QueryClient, conversationId: string, patch: Partial<ChatConversation>) {
  qc.setQueryData<ChatConversation[]>(chatKeys.conversations, (list) =>
    list?.map((c) => (c.id === conversationId ? { ...c, ...patch } : c)),
  )
}
