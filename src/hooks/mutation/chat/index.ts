import { useMutation, useQueryClient } from '@tanstack/react-query'
import { claimChatUsername, markChatRead, openChatConversation, sendChatMessage } from '@/src/services/chat'
import { bumpConversation, chatKeys, patchConversation, updateMessage, upsertMessage } from '@/src/hooks/query/chat'
import type { ChatConversation, ChatMessage } from '@/src/models/chat'

export const useClaimUsername = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (username: string) => claimChatUsername(username),
    onSuccess: (me) => qc.setQueryData(chatKeys.me, me),
  })
}

export const useOpenConversation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (username: string) => openChatConversation(username),
    onSuccess: (conversation) => {
      qc.setQueryData<ChatConversation[]>(chatKeys.conversations, (list) =>
        list && !list.some((c) => c.id === conversation.id) ? [conversation, ...list] : list,
      )
    },
  })
}

// Optimistic: pesan langsung tampil (pending), diganti versi server lewat clientId.
// Kirim ulang pakai clientId yang sama → BE tidak bikin pesan dobel.
export const useSendMessage = (conversationId: string, myId: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ content, clientId }: { content: string; clientId: string; createdAt?: string }) =>
      sendChatMessage(conversationId, content, clientId),
    onMutate: ({ content, clientId, createdAt }) => {
      const optimistic: ChatMessage = {
        id: `tmp-${clientId}`,
        conversationId,
        senderId: myId,
        type: 'TEXT',
        content,
        isDeleted: false,
        clientId,
        createdAt: createdAt ?? new Date().toISOString(),
        pending: true,
      }
      upsertMessage(qc, conversationId, optimistic)
      bumpConversation(qc, conversationId, optimistic, { incrementUnread: false })
    },
    onSuccess: (message) => {
      upsertMessage(qc, conversationId, message)
    },
    onError: (_err, { clientId }) => {
      updateMessage(qc, conversationId, clientId, { pending: false, failed: true })
    },
  })
}

export const useMarkRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (conversationId: string) => markChatRead(conversationId),
    onMutate: (conversationId) => patchConversation(qc, conversationId, { unreadCount: 0 }),
  })
}
