import { bookingListState } from '@/src/models/bookings/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const STATUS_STYLE: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  EXPIRED: { label: 'Expired', color: 'bg-gray-100 text-gray-600' },
  CHECKED_IN: { label: 'Checked In', color: 'bg-green-100 text-green-800' },
  CHECKED_OUT: { label: 'Checked Out', color: 'bg-purple-100 text-purple-800' },
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export const bookingColumns: ColumnDef<bookingListState>[] = [
  {
    accessorKey: 'bookingCode',
    header: 'Booking Code',
    cell: (info) => (
      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'contact',
    header: 'Tamu',
    accessorFn: (row) => row.contact?.fullName ?? '-',
    cell: (info) => {
      const row = info.row.original;
      return (
        <div>
          <p className="font-semibold text-gray-800 text-sm">{row.contact?.fullName ?? '-'}</p>
          <p className="text-xs text-gray-400">{row.contact?.phone ?? ''}</p>
        </div>
      );
    },
  },
  {
    id: 'rooms',
    header: 'Room',
    cell: (info) => {
      const items = info.row.original.items;
      if (!items?.length) return <span className="text-gray-400 text-xs">-</span>;
      return (
        <div className="flex flex-col gap-1">
          {items.map((item) => {
            const roomName = item.roomType?.translations?.find((t) => t.lang === 'id')?.name
              ?? item.roomType?.translations?.[0]?.name
              ?? '-';
            return (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                  {item.room?.number ?? 'TBA'}
                </span>
                <span className="text-xs text-gray-500">{roomName}</span>
              </div>
            );
          })}
        </div>
      );
    },
  },
  {
    id: 'date',
    header: 'Tanggal',
    cell: (info) => {
      const row = info.row.original;
      const checkIn = new Date(row.checkInDate);
      const checkOut = new Date(row.checkOutDate);
      const fmt = (d: Date) =>
        d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      return (
        <div>
          <p className="text-sm text-gray-800">{fmt(checkIn)}</p>
          <p className="text-xs text-gray-400">→ {fmt(checkOut)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: (info) => (
      <span className="font-semibold text-gray-800 text-sm">
        {formatRupiah(info.getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string;
      const { label, color } = STATUS_STYLE[status] ?? {
        label: status,
        color: 'bg-gray-100 text-gray-800',
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${color}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/booking/${item.bookingCode}`}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Detail
          </Link>
        </div>
      );
    },
  },
];