import { userLogsState } from '@/src/models/userLogs/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

function getInitial(name: string | null) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export const userLogColumns: ColumnDef<userLogsState>[] = [
  {
    id: 'user',
    header: 'User',
    cell: (info) => {
      const row = info.row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0 overflow-hidden">
            {row.avatarUrl ? (
              <img src={row.avatarUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              getInitial(row.name)
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{row.name ?? '-'}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: (info) => (
      <span className="text-sm text-gray-700">{info.getValue() as string ?? '-'}</span>
    ),
  },
  {
    accessorKey: 'totalBookings',
    header: 'Bookings',
    cell: (info) => (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
        {info.getValue() as number}
      </span>
    ),
  },
  {
    accessorKey: 'totalRefunds',
    header: 'Refunds',
    cell: (info) => {
      const val = info.getValue() as number;
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
            val > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
          }`}
        >
          {val}
        </span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: (info) => {
      const active = info.getValue() as boolean;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {active ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return (
        <span className="text-sm text-gray-500">
          {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
        <Link
          href={`/dashboard/user-log/${encodeURIComponent(item.id)}`}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1 w-fit"
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
      );
    },
  },
];