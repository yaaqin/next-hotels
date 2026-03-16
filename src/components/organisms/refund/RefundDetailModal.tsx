import { refundListState } from '@/src/models/refund/list'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

interface RefundDetailModalProps {
  refund: refundListState | null
  onClose: () => void
  onApprove: (refund: refundListState) => void
}

export function RefundDetailModal({ refund, onClose, onApprove }: RefundDetailModalProps) {
  if (!refund) return null

  const isPending = refund.status === 'PENDING'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-dashed border-gray-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
              <p className="text-xs tracking-widest uppercase text-gray-400">Detail Refund</p>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {refund.booking.bookingCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-lg leading-none"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">

          {/* Guest */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Tamu</p>
            <p className="text-sm font-semibold text-gray-800">{refund.booking.contact.fullName}</p>
            <p className="text-xs text-gray-500">{refund.booking.contact.email}</p>
            <p className="text-xs text-gray-500">{refund.booking.contact.phone}</p>
          </div>

          {/* Booking detail */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Info Booking</p>
            <Row label="Hotel" value={refund.booking.site.nama} />
            <Row label="Check-in" value={formatDate(refund.booking.checkInDate)} />
            <Row label="Check-out" value={formatDate(refund.booking.checkOutDate)} />
            <Row label="Site" value={refund.booking.siteCode} />
          </div>

          {/* Refund breakdown */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 space-y-1.5">
            <p className="text-xs text-amber-600 tracking-widest uppercase mb-2 font-medium">
              Rincian Refund · {refund.policy.name}
            </p>
            <Row label="Total Booking" value={formatRupiah(refund.originalAmount)} />
            <Row label={`Refund (${refund.refundPercent}%)`} value={formatRupiah(refund.refundAmount)} valueClass="text-green-700" />
            <div className="border-t border-amber-100 mt-2 pt-2">
              <Row label="Penalty" value={`− ${formatRupiah(refund.penaltyAmount)}`} valueClass="text-red-500" />
            </div>
          </div>

          {/* Meta */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 space-y-1.5">
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Info Pengajuan</p>
            <Row label="Tipe" value={refund.refundType ?? '—'} />
            <Row label="Status" value={refund.status} />
            <Row label="Diajukan" value={formatDate(refund.requestedAt)} />
            {refund.processedAt && <Row label="Diproses" value={formatDate(refund.processedAt)} />}
            {refund.canProcessAt && <Row label="Bisa diproses" value={formatDate(refund.canProcessAt)} />}
          </div>

          {/* Reason */}
          {refund.reason && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Alasan</p>
              <p className="text-sm text-gray-700 leading-relaxed">{refund.reason}</p>
            </div>
          )}

          {/* Admin note */}
          {refund.note && (
            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-400 tracking-widest uppercase mb-2">Catatan Admin</p>
              <p className="text-sm text-gray-700 leading-relaxed">{refund.note}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition"
          >
            Tutup
          </button>
          {isPending && (
            <button
              onClick={() => onApprove(refund)}
              className="flex-1 py-3 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Approve Refund
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  valueClass = 'text-gray-700',
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}