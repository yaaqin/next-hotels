'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatMessages } from '@/src/hooks/query/chat'
import { useMarkRead, useSendMessage } from '@/src/hooks/mutation/chat'
import type { ChatConversation, ChatMe, ChatMessage } from '@/src/models/chat'
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { LANG_LOCALE } from '@/src/utils/currencyCookie'
import { ChatAvatar } from './ChatAvatar'

const MAX_LENGTH = 2000

function newClientId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function dayKey(iso: string) {
  return new Date(iso).toDateString()
}

export function ChatThread({
  me,
  conversation,
  onBack,
}: {
  me: ChatMe
  conversation: ChatConversation
  onBack: () => void
}) {
  const { t } = useTranslation()
  const locale = LANG_LOCALE[useCurrentLanguage()]
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChatMessages(conversation.id)
  const send = useSendMessage(conversation.id, me.id)
  const markRead = useMarkRead()

  const [draft, setDraft] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Halaman [0] = terbaru → dibalik supaya urut lama ke baru
  const messages = useMemo(
    () => (data ? [...data.pages].reverse().flatMap((p) => p.messages) : []),
    [data],
  )
  const last = messages[messages.length - 1]

  // ── Scroll: ke bawah saat buka / ada pesan baru; tahan posisi saat muat pesan lama ──
  const olderAnchor = useRef<number | null>(null)
  const stickToBottom = useRef(true)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (olderAnchor.current !== null) {
      el.scrollTop = el.scrollHeight - olderAnchor.current
      olderAnchor.current = null
      return
    }
    if (stickToBottom.current || last?.senderId === me.id) el.scrollTop = el.scrollHeight
  }, [messages.length, last?.id])

  useEffect(() => {
    stickToBottom.current = true
  }, [conversation.id])

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  const loadOlder = () => {
    const el = scrollRef.current
    if (el) olderAnchor.current = el.scrollHeight - el.scrollTop
    fetchNextPage()
  }

  // ── Tandai dibaca: saat thread terbuka & terlihat, dan ada pesan masuk / unread ──
  const lastMarked = useRef<string | null>(null)
  useEffect(() => {
    if (!last || last.pending) return
    const needs = conversation.unreadCount > 0 || last.senderId !== me.id
    if (!needs || lastMarked.current === last.id || document.visibilityState !== 'visible') return
    lastMarked.current = last.id
    markRead.mutate(conversation.id)
  }, [conversation.id, last?.id, conversation.unreadCount])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && conversation.unreadCount > 0) markRead.mutate(conversation.id)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [conversation.id, conversation.unreadCount])

  // ── Kirim ──
  const submit = () => {
    const content = draft.trim()
    if (!content || content.length > MAX_LENGTH) return
    send.mutate({ content, clientId: newClientId() })
    setDraft('')
    stickToBottom.current = true
    textareaRef.current?.focus()
  }

  const retry = (m: ChatMessage) => {
    if (!m.clientId) return
    send.mutate({ content: m.content, clientId: m.clientId, createdAt: m.createdAt })
  }

  // Textarea tumbuh sampai ±5 baris
  useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [draft])

  const dayLabel = (iso: string) => {
    const d = new Date(iso)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return t('chat.today')
    if (d.toDateString() === yesterday.toDateString()) return t('chat.yesterday')
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Status "Dibaca/Terkirim" hanya di pesan saya yang paling akhir
  const lastMine = [...messages].reverse().find((m) => m.senderId === me.id && !m.pending && !m.failed)
  const peerRead = (m: ChatMessage) =>
    !!conversation.peerLastReadAt && new Date(conversation.peerLastReadAt) >= new Date(m.createdAt)

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="md:hidden text-gray-400 hover:text-gray-600 text-sm pr-1"
          aria-label={t('chat.back')}
        >
          ←
        </button>
        <ChatAvatar user={conversation.peer} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">@{conversation.peer?.username ?? '—'}</p>
          {conversation.peer?.name && <p className="text-xs text-gray-400 truncate">{conversation.peer.name}</p>}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-1 bg-[#f8f8f6]">
        {hasNextPage && (
          <div className="flex justify-center pb-2">
            <button
              onClick={loadOlder}
              disabled={isFetchingNextPage}
              className="text-xs text-blue-500 hover:text-blue-600 disabled:text-gray-300"
            >
              {t('chat.loadOlder')}
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !messages.length ? (
          <p className="text-center text-sm text-gray-400 py-12">{t('chat.noMessages')}</p>
        ) : (
          messages.map((m, i) => {
            const mine = m.senderId === me.id
            const prev = messages[i - 1]
            const newDay = !prev || dayKey(prev.createdAt) !== dayKey(m.createdAt)
            return (
              <div key={m.clientId ?? m.id}>
                {newDay && (
                  <div className="flex justify-center py-3">
                    <span className="text-[10px] tracking-wide text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1">
                      {dayLabel(m.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] md:max-w-[65%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                    <button
                      type="button"
                      disabled={!m.failed}
                      onClick={() => retry(m)}
                      className={`px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words text-left
                        ${mine
                          ? `bg-blue-500 text-white rounded-br-md ${m.pending ? 'opacity-60' : ''} ${m.failed ? 'bg-red-400 cursor-pointer' : 'cursor-default'}`
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md cursor-default'}`}
                    >
                      {m.isDeleted ? <span className="italic opacity-70">{t('chat.deleted')}</span> : m.content}
                    </button>
                    <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                      {m.failed
                        ? <span className="text-red-500">{t('chat.failed')}</span>
                        : m.pending
                          ? t('chat.sending')
                          : new Date(m.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                      {lastMine?.id === m.id && (
                        <span className={peerRead(m) ? 'text-blue-500' : ''}>
                          {' · '}{peerRead(m) ? t('chat.read') : t('chat.sent')}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-gray-100 p-3 flex items-end gap-2">
        <textarea
          data-cy="input-chat-message"
          ref={textareaRef}
          value={draft}
          rows={1}
          maxLength={MAX_LENGTH}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            // Enter kirim, Shift+Enter baris baru; jangan kirim saat IME (jpn/chn) masih menyusun kata
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              submit()
            }
          }}
          placeholder={t('chat.inputPlaceholder')}
          className="flex-1 resize-none px-4 py-2.5 text-sm border border-gray-200 rounded-2xl outline-none focus:border-blue-400 transition max-h-[120px]"
        />
        <button
          data-cy="btn-chat-send"
          onClick={submit}
          disabled={!draft.trim()}
          className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition shrink-0
            ${draft.trim() ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
        >
          {t('chat.send')}
        </button>
      </div>
    </div>
  )
}
