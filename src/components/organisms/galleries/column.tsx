import { galleryListState } from '@/src/models/galleries/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const galleryColumns: ColumnDef<galleryListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info) => (
      <span className="font-medium">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return (
        <span className="text-gray-700">
          {date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      );
    },
  },
  {
    id: 'totalImages',
    header: 'Total Images',
    accessorFn: (row) => row.imageIds?.length ?? 0,
    cell: (info) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {info.getValue() as number}
      </span>
    ),
  },
  {
    id: 'createdBy',
    header: 'Created By',
    accessorFn: (row) => row.creator?.username ?? '-',
    cell: (info) => (
      <span className="text-gray-700">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const gallery = row.original;
      return (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/gallery/${gallery.id}`}
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