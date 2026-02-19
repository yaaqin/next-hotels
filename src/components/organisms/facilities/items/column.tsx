import { facilityItemsListState } from '@/src/models/facilities/listitems';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const facilityItemColumns: ColumnDef<facilityItemsListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => (
      <span className="font-semibold text-gray-800">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'type',
    header: 'Type',
    accessorFn: (row) => row.type?.name ?? '-',
    cell: (info) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 uppercase tracking-wide">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return (
        <span className="text-sm text-gray-600">
          {date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
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
            href={`/dashboard/facility-item/${item.id}`}
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