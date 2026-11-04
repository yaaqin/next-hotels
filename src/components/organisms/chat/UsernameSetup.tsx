'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUsernameCheck } from '@/src/hooks/query/chat'
import { useClaimUsername } from '@/src/hooks/mutation/chat'
import type { ChatMe } from '@/src/models/chat'
import { ChatAvatar } from './ChatAvatar'

// Wajib sebelum bisa chat: username unik, sekali set tidak bisa diganti
export function UsernameSetup({ me }: { me: ChatMe }) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [debounced, setDebounced] = useState('')
  const claim = useClaimUsername()

  const trimmed = value.trim().replace(/^@/, '')
  useEffect(() => {
    const id = setTimeout(() => setDebounced(trimmed), 400)
    return () => clearTimeout(id)
  }, [trimmed])

  const { data: check, isFetching } = useUsernameCheck(debounced)
  const isCurrent = !!check && check.username === trimmed && debounced === trimmed
  const canSubmit = !!trimmed && isCurrent && check.available && !claim.isPending

  const status = !trimmed
    ? null
    : !isCurrent || isFetching
      ? { tone: 'text-gray-400', text: t('chat.checking') }
      : check.available
        ? { tone: 'text-emerald-600', text: t('chat.available') }
        : { tone: 'text-red-500', text: t(`chat.reason.${check.reason}`) }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) claim.mutate(trimmed)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <ChatAvatar user={me} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{me.name ?? me.email}</p>
            <p className="text-xs text-gray-400 truncate">{me.email}</p>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">{t('chat.setupTitle')}</h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t('chat.setupDesc')}</p>
        </div>

        <div>
          <div className="flex items-center border border-gray-200 rounded-xl focus-within:border-blue-400 transition">
            <span className="pl-4 text-gray-400">@</span>
            <input
              data-cy="input-chat-username"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={t('chat.setupPlaceholder')}
              className="flex-1 px-2 py-3 text-sm bg-transparent outline-none"
            />
          </div>
          <p className={`text-xs mt-2 min-h-[1rem] ${status?.tone ?? ''}`}>{status?.text}</p>
          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{t('chat.setupRules')}</p>
        </div>

        <button
          data-cy="btn-chat-username-save"
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl text-sm font-medium transition
            ${canSubmit ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
        >
          {claim.isPending ? t('chat.saving') : t('chat.setupSubmit')}
        </button>
      </form>
    </div>
  )
}
