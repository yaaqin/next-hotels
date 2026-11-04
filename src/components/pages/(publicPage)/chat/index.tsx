'use client'

import { useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSafeSession } from '@/src/hooks/custom/payment/useSafeSession'
import {
  bumpConversation,
  chatKeys,
  patchConversation,
  upsertMessage,
  useChatConversations,
  useChatMe,
} from '@/src/hooks/query/chat'
import { useOpenConversation } from '@/src/hooks/mutation/chat'
import { useChatSocket } from '@/src/hooks/custom/chat/useChatSocket'
import type { ChatMe } from '@/src/models/chat'
import { UsernameSetup } from '@/src/components/organisms/chat/UsernameSetup'
import { ConversationList } from '@/src/components/organisms/chat/ConversationList'
import { ChatThread } from '@/src/components/organisms/chat/ChatThread'

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ChatLoginGate() {
  const { t } = useTranslation()
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-2xl">💬</div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{t('chat.loginTitle')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('chat.loginDesc')}</p>
        </div>
        <button
          onClick={() => signIn('google', { callbackUrl: '/chat' })}
          className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition"
        >
          {t('chat.loginButton')}
        </button>
      </div>
    </div>
  )
}

// Login Google → wajib username → baru masuk chat
export default function ChatPage() {
  const { isLoading, isAuthenticated } = useSafeSession()
  if (isLoading) return <Spinner />
  if (!isAuthenticated) return <ChatLoginGate />
  return <ChatGate />
}

function ChatGate() {
  const { t } = useTranslation()
  const { data: me, isLoading, isError, refetch } = useChatMe(true)

  if (isLoading) return <Spinner />
  if (isError || !me) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <p className="text-sm text-gray-500">{t('chat.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm text-blue-500 hover:text-blue-600">{t('chat.retry')}</button>
      </div>
    )
  }
  if (!me.hasUsername) return <UsernameSetup me={me} />
  return <ChatApp me={me} />
}

function ChatApp({ me }: { me: ChatMe }) {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('c')

  const { data: conversations = [], isLoading } = useChatConversations(true)
  const selected = conversations.find((c) => c.id === selectedId) ?? null
  const open = useOpenConversation()

  // Percakapan aktif disimpan di URL (?c=) supaya bisa di-refresh / dibagikan ke diri sendiri
  const select = (id: string | null) => router.replace(id ? `/chat?c=${id}` : '/chat', { scroll: false })

  const selectedRef = useRef(selectedId)
  selectedRef.current = selectedId

  const { connected } = useChatSocket(true, {
    onMessage: ({ conversationId, message }) => {
      const isOpen = selectedRef.current === conversationId && document.visibilityState === 'visible'
      upsertMessage(qc, conversationId, message)
      const known = bumpConversation(qc, conversationId, message, {
        incrementUnread: message.senderId !== me.id && !isOpen,
      })
      // Percakapan baru dari orang lain → ambil ulang daftar
      if (!known) qc.invalidateQueries({ queryKey: chatKeys.conversations })
    },
    onRead: ({ conversationId, userId, lastReadAt }) => {
      if (userId === me.id) patchConversation(qc, conversationId, { unreadCount: 0 })
      else patchConversation(qc, conversationId, { peerLastReadAt: lastReadAt })
    },
    onReconnect: () => {
      qc.invalidateQueries({ queryKey: chatKeys.conversations })
      qc.invalidateQueries({ queryKey: ['chat', 'messages'] })
    },
  })

  return (
    <div className="w-full max-w-5xl mx-auto px-0 md:px-6 py-0 md:py-8">
      <div className="hidden md:flex items-end justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('chat.title')}</h1>
          <p className="text-sm text-gray-400">{t('chat.subtitle')}</p>
        </div>
        {!connected && <span className="text-xs text-amber-500">{t('chat.offline')}</span>}
      </div>

      <div className="bg-white md:rounded-2xl md:border border-gray-100 md:shadow-sm overflow-hidden flex h-[calc(100dvh-64px)] md:h-[calc(100dvh-220px)] md:min-h-[480px]">
        <div className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 md:border-r border-gray-100 min-h-0`}>
          <ConversationList
            me={me}
            conversations={conversations}
            loading={isLoading}
            selectedId={selectedId}
            opening={open.isPending}
            onSelect={select}
            onOpenUsername={(username) => open.mutate(username, { onSuccess: (c) => select(c.id) })}
          />
        </div>

        <div className={`${selected ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0 min-h-0`}>
          {selected ? (
            <ChatThread key={selected.id} me={me} conversation={selected} onBack={() => select(null)} />
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f8f6]">
              <p className="text-sm text-gray-400 text-center max-w-xs">{t('chat.selectConversation')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
