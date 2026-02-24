import { userListState } from '@/src/models/users/list'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const userColumns: ColumnDef<userListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: (info) => (
      <span className="font-semibold">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (info) => (
      <span className="text-gray-700">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'sitecode',
    header: 'Site Code',
    cell: (info) => (
      <span className="text-gray-700">
        {(info.getValue() as string) || '-'}
      </span>
    ),
  },
  {
    id: 'role',
    header: 'Role',
    accessorFn: (row) => row.role?.name ?? '-',
    cell: (info) => (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-md ${
          info.getValue()
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {(info.getValue() as boolean) ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original
      return (
        <Link
          href={`/dashboard/user/${user.id}`}
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