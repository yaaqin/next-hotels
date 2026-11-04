import { axiosUser } from '@/src/libs/instance'
import type {
  ChatApiResponse,
  ChatConversation,
  ChatMe,
  ChatMessage,
  ChatMessagePage,
  ChatUser,
  UsernameCheck,
} from '@/src/models/chat'

export const getChatMe = async () =>
  (await axiosUser.get<ChatApiResponse<ChatMe>>('/chat/me')).data.data

export const checkChatUsername = async (username: string) =>
  (await axiosUser.get<ChatApiResponse<UsernameCheck>>('/chat/username/check', { params: { username } })).data.data

export const claimChatUsername = async (username: string) =>
  (await axiosUser.post<ChatApiResponse<ChatMe>>('/chat/username', { username })).data.data

export const searchChatUsers = async (q: string) =>
  (await axiosUser.get<ChatApiResponse<ChatUser[]>>('/chat/users/search', { params: { q } })).data.data

export const getChatConversations = async () =>
  (await axiosUser.get<ChatApiResponse<ChatConversation[]>>('/chat/conversations')).data.data

export const getChatConversation = async (id: string) =>
  (await axiosUser.get<ChatApiResponse<ChatConversation>>(`/chat/conversations/${id}`)).data.data

export const openChatConversation = async (username: string) =>
  (await axiosUser.post<ChatApiResponse<ChatConversation>>('/chat/conversations', { username })).data.data

export const getChatMessages = async (conversationId: string, before?: string) =>
  (
    await axiosUser.get<ChatApiResponse<ChatMessagePage>>(`/chat/conversations/${conversationId}/messages`, {
      params: before ? { before } : undefined,
    })
  ).data.data

export const sendChatMessage = async (conversationId: string, content: string, clientId: string) =>
  (
    await axiosUser.post<ChatApiResponse<ChatMessage>>(`/chat/conversations/${conversationId}/messages`, {
      content,
      clientId,
    })
  ).data.data

export const markChatRead = async (conversationId: string) =>
  (await axiosUser.post<ChatApiResponse<{ conversationId: string; lastReadAt: string }>>(
    `/chat/conversations/${conversationId}/read`,
  )).data.data
