'use client'

import { useState } from 'react'
import Loading from '../../organisms/loading'
import { EditRateModal } from '../../organisms/currency/EditRateModal'
import { useCurrencyAdminList } from '@/src/hooks/query/currency/adminList'
import { useRefreshRates, useResetRateToAuto, useSetManualRate } from '@/src/hooks/mutation/currency/rates'
import { currencyAdminItem } from '@/src/models/currency/list'
import { formatMoney, formatRate } from '@/src/utils/money'

const SAMPLE_IDR = 1_000_000

const formatUpdated = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(iso))

function SourceBadge({ item }: { item: currencyAdminItem }) {
  if (item.code === 'IDR') {
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">BASE</span>
  }
  if (!item.rate) {
    return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">Belum ada kurs</span>
  }
  return item.rate.source === 'MANUAL' ? (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
      MANUAL{item.rate.updatedByUsername ? ` · ${item.rate.updatedByUsername}` : ''}
    </span>
  ) : (
    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">AUTO</span>
  )
}

export default function CurrencyRatePage() {
  const { data, isLoading } = useCurrencyAdminList()
  const setManual = useSetManualRate()
  const resetAuto = useResetRateToAuto()
  const refresh = useRefreshRates()
  const [editing, setEditing] = useState<currencyAdminItem | null>(null)

  const canManage = data?.data.canManage ?? false
  const currencies = data?.data.currencies ?? []

  return (
    <div className="space-y-4">
      {editing && (
        <EditRateModal
          currency={editing}
          isSaving={setManual.isPending}
          onClose={() => setEditing(null)}
          onSave={(idrPerUnit) =>
            setManual.mutate({ code: editing.code, idrPerUnit }, { onSuccess: () => setEditing(null) })
          }
        />
      )}

      <section className="flex items-start justify-between gap-4">
        <div>
          <h5 className="text-3xl font-bold">Currency Rate</h5>
          <p className="text-sm text-gray-500 mt-1">
            Kurs untuk tampilan harga ke user. Pembayaran tetap ditagih dalam IDR. Kurs otomatis diperbarui tiap hari jam 01.00 WIB.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => refresh.mutate()}
            disabled={refresh.isPending}
            className="shrink-0 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            {refresh.isPending ? 'Memperbarui...' : 'Perbarui kurs sekarang'}
          </button>
        )}
      </section>

      {!isLoading && !canManage && (
        <div className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-amber-700">
          Hanya akun pusat (Superadmin) yang bisa mengubah kurs. Kamu cuma bisa melihat.
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Currency</th>
                <th className="px-6 py-3">Rate</th>
                <th className="px-6 py-3">{formatMoney(SAMPLE_IDR, 'IDR', 'id-ID')} ≈</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Updated</th>
                {canManage && <th className="px-6 py-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currencies.map((item) => {
                const isBase = item.code === 'IDR'
                const rate = item.rate?.idrPerUnit
                return (
                  <tr key={item.code} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{item.code}</span>
                      <span className="ml-2 text-gray-400">{item.symbol}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {isBase ? '1 IDR = Rp 1' : rate ? formatRate(item.code, rate) : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {isBase
                        ? formatMoney(SAMPLE_IDR, 'IDR', 'id-ID')
                        : rate
                          ? formatMoney(SAMPLE_IDR / rate, item.code, 'en-US', item.decimals)
                          : '—'}
                    </td>
                    <td className="px-6 py-4"><SourceBadge item={item} /></td>
                    <td className="px-6 py-4 text-gray-500">{item.rate ? formatUpdated(item.rate.updatedAt) : '—'}</td>
                    {canManage && (
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                        {!isBase && (
                          <button onClick={() => setEditing(item)} className="text-blue-600 hover:underline">
                            Ubah kurs
                          </button>
                        )}
                        {item.rate?.source === 'MANUAL' && (
                          <button
                            onClick={() => resetAuto.mutate(item.code)}
                            disabled={resetAuto.isPending}
                            className="text-gray-500 hover:underline disabled:opacity-50"
                          >
                            Kembali otomatis
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
