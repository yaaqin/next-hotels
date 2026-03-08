import { roomListState } from '@/src/models/room/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const roomColumns: ColumnDef<roomListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'siteCode',
    header: 'Site Code',
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'number',
    header: 'Room Number',
    cell: (info) => (
      <span className="font-semibold text-blue-700">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'roomType',
    header: 'Room Type',
    accessorFn: (row) => row.roomType?.name ?? '-',
    cell: (info) => (
      <span className="text-gray-700">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'bedType',
    header: 'Bed Type',
    accessorFn: (row) => row.bedType?.name ?? '-',
    cell: (info) => (
      <span className="text-gray-700">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/room/${row.original.id}`}
        className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1 w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Detail
      </Link>
    ),
  },
];