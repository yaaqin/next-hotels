import { refundListState } from '@/src/models/refund/list'
import { ColumnDef } from '@tanstack/react-table'

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-800' },
  APPROVED:  { label: 'Approved',  color: 'bg-blue-100 text-blue-800'    },
  REJECTED:  { label: 'Rejected',  color: 'bg-red-100 text-red-800'      },
  PROCESSED: { label: 'Processed', color: 'bg-green-100 text-green-800'  },
}

const REFUND_TYPE_STYLE: Record<string, { label: string; color: string }> = {
  CREDIT: { label: 'Credit', color: 'bg-blue-50 text-blue-600'   },
  CASH:   { label: 'Cash',   color: 'bg-green-50 text-green-700' },
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface RefundColumnsProps {
  onDetail: (refund: refundListState) => void
}

export const refundColumns = ({ onDetail }: RefundColumnsProps): ColumnDef<refundListState>[] => [
  {
    id: 'booking',
    header: 'Booking',
    cell: (info) => {
      const row = info.row.original
      return (
        <div>
          <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {row.booking.bookingCode}
          </span>
          <p className="text-xs text-gray-400 mt-1">{row.booking.site.nama}</p>
        </div>
      )
    },
  },
  {
    id: 'guest',
    header: 'Tamu',
    cell: (info) => {
      const { contact } = info.row.original.booking
      return (
        <div>
          <p className="text-sm font-semibold text-gray-800">{contact.fullName}</p>
          <p className="text-xs text-gray-400">{contact.phone}</p>
        </div>
      )
    },
  },
  {
    id: 'dates',
    header: 'Check-in / out',
    cell: (info) => {
      const { checkInDate, checkOutDate } = info.row.original.booking
      return (
        <div>
          <p className="text-sm text-gray-800">{formatDate(checkInDate)}</p>
          <p className="text-xs text-gray-400">→ {formatDate(checkOutDate)}</p>
        </div>
      )
    },
  },
  {
    id: 'amounts',
    header: 'Refund',
    cell: (info) => {
      const { originalAmount, refundAmount, penaltyAmount, refundPercent } = info.row.original
      return (
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-gray-800">{formatRupiah(refundAmount)}</p>
          <p className="text-xs text-gray-400">
            dari {formatRupiah(originalAmount)} · {refundPercent}%
          </p>
          {penaltyAmount > 0 && (
            <p className="text-xs text-red-400">− {formatRupiah(penaltyAmount)}</p>
          )}
        </div>
      )
    },
  },
  {
    id: 'policy',
    header: 'Kebijakan',
    cell: (info) => {
      const { policy } = info.row.original
      return (
        <p className="text-xs text-gray-600 max-w-[120px] leading-relaxed">{policy.name}</p>
      )
    },
  },
  {
    id: 'refundType',
    header: 'Tipe',
    cell: (info) => {
      const type = info.row.original.refundType
      if (!type) return <span className="text-gray-300 text-xs">—</span>
      const cfg = REFUND_TYPE_STYLE[type] ?? { label: type, color: 'bg-gray-100 text-gray-600' }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${cfg.color}`}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string
      const cfg = STATUS_STYLE[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${cfg.color}`}>
          {cfg.label}
        </span>
      )
    },
  },
  {
    id: 'requestedAt',
    header: 'Diajukan',
    cell: (info) => (
      <p className="text-xs text-gray-500">{formatDate(info.row.original.requestedAt)}</p>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        onClick={() => onDetail(row.original)}
        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Detail
      </button>
    ),
  },
]