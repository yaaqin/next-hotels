'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatUserSearch } from '@/src/hooks/query/chat'
import type { ChatConversation, ChatMe } from '@/src/models/chat'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import { ChatAvatar } from './ChatAvatar'

function formatListTime(iso: string | null, locale: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  return d.toDateString() === now.toDateString()
    ? d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString(locale, { day: 'numeric', month: 'short' })
}

export function ConversationList({
  me,
  conversations,
  loading,
  selectedId,
  opening,
  onSelect,
  onOpenUsername,
}: {
  me: ChatMe
  conversations: ChatConversation[]
  loading: boolean
  selectedId: string | null
  opening: boolean
  onSelect: (id: string) => void
  onOpenUsername: (username: string) => void
}) {
  const { t } = useTranslation()
  const locale = LANG_LOCALE[useCurrentLanguage()]
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')

  const q = query.trim().replace(/^@/, '')
  useEffect(() => {
    const id = setTimeout(() => setDebounced(q), 300)
    return () => clearTimeout(id)
  }, [q])

  const searching = q.length > 0
  const { data: results, isFetching } = useChatUserSearch(debounced)

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ChatAvatar user={me} size="sm" />
          <span className="truncate">@{me.username}</span>
        </div>
        <input
          data-cy="input-chat-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('chat.searchPlaceholder')}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition"
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {searching ? (
          q.length < 2 ? (
            <p className="p-6 text-xs text-gray-400 text-center">{t('chat.searchHint')}</p>
          ) : isFetching || debounced !== q ? (
            <p className="p-6 text-xs text-gray-400 text-center">{t('chat.searching')}</p>
          ) : !results?.length ? (
            <p className="p-6 text-xs text-gray-400 text-center">{t('chat.searchEmpty')}</p>
          ) : (
            results.map((user) => (
              <button
                key={user.id}
                data-cy={`chat-search-result-${user.username}`}
                disabled={opening}
                onClick={() => {
                  onOpenUsername(user.username!)
                  setQuery('')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition disabled:opacity-50"
              >
                <ChatAvatar user={user} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">@{user.username}</p>
                  {user.name && <p className="text-xs text-gray-400 truncate">{user.name}</p>}
                </div>
              </button>
            ))
          )
        ) : loading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !conversations.length ? (
          <p className="p-6 text-sm text-gray-400 text-center leading-relaxed">{t('chat.listEmpty')}</p>
        ) : (
          conversations.map((c) => {
            const mine = c.lastMessageSenderId === me.id
            return (
              <button
                key={c.id}
                data-cy={`chat-conversation-${c.id}`}
                onClick={() => onSelect(c.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition border-l-2
                  ${selectedId === c.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50'}`}
              >
                <ChatAvatar user={c.peer} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">@{c.peer?.username ?? '—'}</p>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatListTime(c.lastMessageAt, locale)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-xs truncate ${c.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                      {c.lastMessagePreview ? `${mine ? `${t('chat.you')}: ` : ''}${c.lastMessagePreview}` : ' '}
                    </p>
                    {c.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {c.unreadCount > 99 ? '99+' : c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
