import { withdrawListState } from '@/src/models/withdraw/list'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  processed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

export const withdrawColumns: ColumnDef<withdrawListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 160,
    cell: (info) => {
      const id = info.getValue() as string
      return (
        <span className="font-mono text-xs text-gray-500 block truncate" title={id}>
          {id}
        </span>
      )
    },
  },
  {
    id: 'userName',
    header: 'User',
    size: 180,
    accessorFn: (row) => row.user?.name ?? '-',
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{info.getValue() as string}</span>
        <span className="text-xs text-gray-400">{info.row.original.user?.email ?? '-'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'amountIdr',
    header: 'Amount (IDR)',
    size: 140,
    cell: (info) => (
      <span className="font-medium text-gray-800">
        {new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        }).format(info.getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: 'rateSnapshot',
    header: 'Rate Snapshot',
    size: 120,
    cell: (info) => (
      <span className="text-gray-700">
        {new Intl.NumberFormat('id-ID').format(info.getValue() as number)}
      </span>
    ),
  },
  {
    accessorKey: 'amountSgt',
    header: 'Amount (SGT)',
    size: 120,
    cell: (info) => (
      <span className="font-medium text-gray-800">
        {(info.getValue() as number).toFixed(4)}
      </span>
    ),
  },
  {
    accessorKey: 'walletAddress',
    header: 'Wallet Address',
    size: 140,
    cell: (info) => {
      const addr = info.getValue() as string
      return (
        <span className="font-mono text-xs text-gray-500 block truncate" title={addr}>
          {addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '-'}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    size: 110,
    cell: (info) => {
      const status = (info.getValue() as string).toLowerCase()
      return (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${
            statusStyles[status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: 'txHash',
    header: 'Tx Hash',
    size: 130,
    cell: (info) => {
      const hash = info.getValue() as string
      return hash ? (
        <span className="font-mono text-xs text-gray-500 block truncate" title={hash}>
          {`${hash.slice(0, 6)}...${hash.slice(-4)}`}
        </span>
      ) : (
        <span className="text-gray-400 text-xs">-</span>
      )
    },
  },
  {
    accessorKey: 'requestedAt',
    header: 'Requested At',
    size: 150,
    cell: (info) => (
      <span className="text-sm text-gray-600">
        {new Date(info.getValue() as string).toLocaleString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'processedAt',
    header: 'Processed At',
    size: 150,
    cell: (info) => {
      const val = info.getValue() as string | null
      return (
        <span className="text-sm text-gray-600">
          {val
            ? new Date(val).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 90,
    cell: ({ row }) => {
      const withdraw = row.original
      return (
        <Link
          href={`/dashboard/withdraw/${withdraw.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
      )
    },
  },
]