type BookingStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'EXPIRED'

const STATUS_CONFIG: Record<BookingStatus, {
  label: string
  badge: string
  text: string
  dot: string
}> = {
  PENDING: {
    label: 'Pending',
    badge: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
  },
  PAID: {
    label: 'Paid',
    badge: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-400',
  },
  CONFIRMED: {
    label: 'Confirmed',
    badge: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
  },
  CHECKED_IN: {
    label: 'Checked In',
    badge: 'bg-purple-50 border-purple-200',
    text: 'text-purple-700',
    dot: 'bg-purple-500',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    badge: 'bg-gray-100 border-gray-200',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-red-50 border-red-200',
    text: 'text-red-600',
    dot: 'bg-red-400',
  },
  EXPIRED: {
    label: 'Expired',
    badge: 'bg-gray-100 border-gray-200',
    text: 'text-gray-400',
    dot: 'bg-gray-300',
  },
}

interface BookingStatusBadgeProps {
  status: BookingStatus
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.EXPIRED

  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.badge} ${cfg.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}