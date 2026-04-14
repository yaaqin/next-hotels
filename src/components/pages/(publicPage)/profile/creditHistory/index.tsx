'use client'

import { useUserCreditHistory } from '@/src/hooks/query/userProfile/creditHistory'
import { CreditCardIcon, ArrowLeft01Icon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d} · ${m} · ${y}`
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function truncateWallet(address: string) {
  if (!address || address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-3)}`
}

function isWalletAddress(str: string) {
  return /^0x[a-fA-F0-9]{10,}$/.test(str)
}

function parseNote(note: string) {
  if (!note) return note
  const walletMatch = note.match(/(wallet:\s*)(0x[a-fA-F0-9]+)/i)
  if (walletMatch) {
    return note.replace(walletMatch[2], truncateWallet(walletMatch[2]))
  }
  return note
}

const SOURCE_TYPE_COLOR: Record<string, string> = {
  REFUND: 'bg-green-50 text-green-700',
  USAGE: 'bg-orange-50 text-orange-600',
  EXPIRED: 'bg-red-50 text-red-600',
  MANUAL: 'bg-blue-50 text-blue-600',
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />
}

function LogIcon({ type }: { type: string }) {
  const isAdd = type === 'ADD'
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdd ? 'bg-green-50' : 'bg-red-50'}`}>
      {isAdd ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#3B6D11" strokeWidth="1.8">
          <path d="M8 3v10M3 8h10" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#A32D2D" strokeWidth="1.8">
          <path d="M3 8h10" />
        </svg>
      )}
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-16" />
      </div>
      <div className="text-right space-y-2 flex-shrink-0">
        <div className="h-2.5 bg-gray-100 rounded w-20 ml-auto" />
        <div className="h-3 bg-gray-100 rounded w-16 ml-auto" />
        <div className="h-2.5 bg-gray-100 rounded w-24 ml-auto" />
      </div>
    </div>
  )
}

export default function CreditHistoryPage() {
  const { data, isLoading } = useUserCreditHistory()
  const { t } = useTranslation()
  const router = useRouter()

  const credit = data?.data

  // Pindah ke dalam komponen supaya t() bisa diakses
  const SOURCE_TYPE_LABEL: Record<string, string> = {
    REFUND: t("text.profile.creditHistory.sourceType.refund"),
    USAGE: t("text.profile.creditHistory.sourceType.usage"),
    EXPIRED: t("text.profile.creditHistory.sourceType.expired"),
    MANUAL: t("text.profile.creditHistory.sourceType.manual"),
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-8 px-4">
      <div className="w-full mx-auto space-y-4">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-3 transition-colors"
          >
            <ArrowLeft01Icon size={13} />
            {t("text.profile.creditHistory.back")}
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {t("text.profile.creditHistory.title")}
          </h1>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
            {t("text.profile.creditHistory.subtitle")}
          </p>
        </div>

        {/* Balance Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCardIcon size={16} className="text-emerald-400" />
              <span className="text-xs tracking-widest uppercase text-gray-400">
                {t("text.profile.creditHistory.creditBalance")}
              </span>
            </div>
            {credit && (
              <span className={`text-[10px] font-medium px-2.5 py-1 rounded-lg tracking-widest uppercase
                ${credit.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {credit.status}
              </span>
            )}
          </div>

          <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1">
            {t("text.profile.creditHistory.availableBalance")}
          </p>
          {isLoading ? (
            <div className="h-8 w-36 bg-gray-100 rounded animate-pulse" />
          ) : (
            <p className="text-3xl font-semibold text-gray-900">
              {formatCurrency(credit?.balance ?? 0)}
            </p>
          )}

          <Divider />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">
                {t("text.profile.creditHistory.validUntil")}
              </p>
              <p className="text-sm font-medium text-gray-900">
                {credit?.expiredAt ? formatDate(credit.expiredAt) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">
                {t("text.profile.creditHistory.totalTransaction")}
              </p>
              <p className="text-sm font-medium text-gray-900">
                {t("text.profile.creditHistory.transactionCount", { count: credit?.logs?.length ?? 0 })}
              </p>
            </div>
          </div>
        </div>

        {/* Log List */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            <span className="text-xs tracking-widest uppercase text-gray-400">
              {t("text.profile.creditHistory.transactionHistory")}
            </span>
          </div>

          {isLoading ? (
            <div className="divide-y divide-gray-100">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : !credit?.logs?.length ? (
            <p className="text-sm text-gray-400 text-center py-6">
              {t("text.profile.creditHistory.noTransaction")}
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {credit.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-3.5">
                  <LogIcon type={log.type} />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 leading-snug break-words">
                      {parseNote(log.note || SOURCE_TYPE_LABEL[log.sourceType] || log.sourceType)}
                    </p>
                    <span className={`inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded tracking-wide font-medium
                      ${SOURCE_TYPE_COLOR[log.sourceType] ?? 'bg-gray-100 text-gray-500'}`}>
                      {log.sourceType}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="text-[11px] text-gray-400 mb-0.5 tabular-nums">
                      {formatDate(log.createdAt)}
                    </p>
                    <p className={`text-sm font-semibold tabular-nums ${log.type === 'ADD' ? 'text-green-700' : 'text-red-600'}`}>
                      {log.type === 'ADD' ? '+' : '−'}{formatCurrency(log.amount)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 tabular-nums">
                      {formatCurrency(log.balanceAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}