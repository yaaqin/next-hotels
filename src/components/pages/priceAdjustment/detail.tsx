'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Loading from '../../organisms/loading'
import PriceCompareCalendar from '../../organisms/priceAdjustment/PriceCompareCalendar'
import { usePriceAdjustmentDetail } from '@/src/hooks/query/priceAdjustment'
import { useApprovePriceAdjustment, useRejectPriceAdjustment } from '@/src/hooks/mutation/priceAdjustment'
import { useMe } from '@/src/hooks/query/auth/me'
import { STATUS_STYLE, describeChange, formatDate } from '../../organisms/priceAdjustment/helpers'

const REVIEWER_ROLES = ['SUPERADMIN', 'OWNER']

export default function PriceAdjustmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = usePriceAdjustmentDetail(id)
  const { data: me } = useMe()
  const approve = useApprovePriceAdjustment()
  const reject = useRejectPriceAdjustment()

  if (isLoading) return <Loading />
  const adj = data?.data
  if (!adj) return <p className="text-sm text-gray-500">Adjustment tidak ditemukan.</p>

  const isDraft = adj.status === 'DRAFT'
  const canReview = isDraft && REVIEWER_ROLES.includes(me?.data?.role?.name ?? '')
  const typeName = (roomTypeId: string) =>
    adj.items.find((i) => i.roomTypeId === roomTypeId)?.roomType.name ?? roomTypeId
  const reviewing = approve.isPending || reject.isPending

  return (
    <div className="space-y-5">
      <section className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/price-adjustment" className="text-xs text-gray-400 hover:underline">← Price Adjustment</Link>
          <h5 className="text-2xl font-bold mt-1">{adj.title}</h5>
          {adj.description && <p className="text-sm text-gray-500 mt-1">{adj.description}</p>}
          <p className="text-sm text-gray-600 mt-2">
            {adj.siteCode} · {formatDate(adj.startDate)} — {formatDate(adj.endDate)} · dibuat {adj.creator.username}
          </p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[adj.status]}`}>{adj.status}</span>
      </section>

      {adj.reviewer && (
        <p className="text-sm text-gray-500">
          {adj.status === 'APPROVED' ? 'Di-approve' : 'Di-reject'} oleh {adj.reviewer.username}
          {adj.reviewedAt && ` · ${formatDate(adj.reviewedAt)}`}
          {adj.reviewNote && ` · "${adj.reviewNote}"`}
        </p>
      )}

      {adj.uncovered.length > 0 && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <p className="font-semibold mb-1">Ada tanggal yang sekarang tidak punya price proposal APPROVED</p>
          {adj.uncovered.map((u) => (
            <p key={u.roomTypeId} className="text-xs">{typeName(u.roomTypeId)}: {u.dates.join(', ')}</p>
          ))}
          <p className="text-xs mt-1">Adjustment ini tidak bisa di-approve sampai tanggal tersebut punya proposal.</p>
        </div>
      )}

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Tipe kamar</th>
              <th className="px-6 py-3">Kamar</th>
              <th className="px-6 py-3">Perubahan (dari harga proposal)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adj.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-3 font-medium text-gray-800">{item.roomType.name ?? item.roomTypeId}</td>
                <td className="px-6 py-3 text-gray-600">{item.room ? item.room.number : 'Semua kamar'}</td>
                <td className="px-6 py-3 text-gray-700">{describeChange(item.adjustment, item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PriceCompareCalendar
        siteCode={adj.siteCode}
        adjustmentId={isDraft ? adj.id : undefined}
        highlight={{ start: adj.startDate.slice(0, 10), end: adj.endDate.slice(0, 10) }}
        initialRoomTypeId={adj.items[0]?.roomTypeId}
        initialMonth={adj.startDate}
      />

      {canReview && (
        <section className="flex justify-end gap-3">
          <button
            disabled={reviewing}
            onClick={() => {
              const note = prompt('Alasan reject (opsional)')
              if (note !== null) reject.mutate({ id: adj.id, note: note || undefined })
            }}
            className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 rounded-md disabled:opacity-50"
          >
            Reject
          </button>
          <button
            disabled={reviewing || adj.uncovered.length > 0}
            onClick={() => {
              if (confirm('Approve adjustment ini? Harga baru langsung dipakai untuk booking berikutnya. Booking yang sudah dibuat tidak berubah.')) {
                approve.mutate({ id: adj.id })
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50"
          >
            {approve.isPending ? 'Approving...' : 'Approve'}
          </button>
        </section>
      )}
    </div>
  )
}
