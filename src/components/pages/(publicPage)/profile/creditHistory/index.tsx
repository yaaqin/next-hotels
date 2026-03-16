'use client'

import { useUserCreditHistory } from '@/src/hooks/query/userProfile/creditHistory'
import { CreditCardIcon, ArrowLeft01Icon } from 'hugeicons-react'
import { useRouter } from 'next/navigation'

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

const SOURCE_TYPE_LABEL: Record<string, string> = {
  REFUND: 'Refund booking',
  USAGE: 'Digunakan untuk booking',
  EXPIRED: 'Kredit kadaluarsa',
  MANUAL: 'Penyesuaian manual',
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-5" />
}

function LogIcon({ type }: { type: string }) {
  const isAdd = type === 'ADD'
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isAdd ? 'bg-green-50' : 'bg-red-50'}`}
    >
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

export default function CreditHistoryPage() {
  const { data, isLoading } = useUserCreditHistory()
  const router = useRouter()

  const credit = data?.data

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-10 px-4">
      <div className="max-w-[680px] mx-auto space-y-4">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-3 transition-colors"
          >
            <ArrowLeft01Icon size={13} />
            Kembali
          </button>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Credit History</h1>
          <p className="text-sm text-gray-400 tracking-widest uppercase mt-1">
            Riwayat transaksi booking credit
          </p>
        </div>

        {/* Balance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <CreditCardIcon size={16} className="text-emerald-400" />
              <span className="text-xs tracking-widest uppercase text-gray-400">Saldo kredit</span>
            </div>
            {credit && (
              <span
                className={`text-[10px] font-medium px-2.5 py-1 rounded-lg tracking-widest uppercase
                  ${credit.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                  }`}
              >
                {credit.status}
              </span>
            )}
          </div>

          <p className="text-[10px] tracking-[0.14em] uppercase text-gray-400 mb-1">
            Saldo tersedia
          </p>
          <p className="text-3xl font-semibold text-gray-900">
            {isLoading ? '—' : formatCurrency(credit?.balance ?? 0)}
          </p>

          <Divider />

          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">
                Berlaku hingga
              </p>
              <p className="text-sm font-medium text-gray-900">
                {credit?.expiredAt ? formatDate(credit.expiredAt) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-1">
                Total transaksi
              </p>
              <p className="text-sm font-medium text-gray-900">
                {credit?.logs?.length ?? 0} transaksi
              </p>
            </div>
          </div>
        </div>

        {/* Log List */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            <span className="text-xs tracking-widest uppercase text-gray-400">
              Riwayat transaksi
            </span>
          </div>

          {isLoading ? (
            <p className="text-xs text-gray-300 text-center py-6">Memuat riwayat...</p>
          ) : !credit?.logs?.length ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada transaksi</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {credit.logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-3">
                  <LogIcon type={log.type} />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">
                      {log.note || SOURCE_TYPE_LABEL[log.sourceType] || log.sourceType}
                    </p>
                    <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 tracking-wide">
                      {log.sourceType}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-[11px] text-gray-400 mb-0.5">
                      {formatDate(log.createdAt)}
                    </p>
                    <p
                      className={`text-sm font-medium
                        ${log.type === 'ADD' ? 'text-green-700' : 'text-red-700'}`}
                    >
                      {log.type === 'ADD' ? '+' : '−'} {formatCurrency(log.amount)}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Saldo: {formatCurrency(log.balanceAfter)}
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