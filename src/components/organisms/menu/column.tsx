import { menuListState } from '@/src/models/menu/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const LEVEL_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Sidebar', color: 'bg-purple-100 text-purple-800' },
  2: { label: 'Navbar Parent', color: 'bg-blue-100 text-blue-800' },
  3: { label: 'Navbar Child', color: 'bg-cyan-100 text-cyan-800' },
  4: { label: 'Standalone', color: 'bg-orange-100 text-orange-800' },
};

export const menuColumns: ColumnDef<menuListState>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (info) => (
      <span className="font-semibold text-gray-800">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: (info) => {
      const level = info.getValue() as number;
      const { label, color } = LEVEL_LABEL[level] ?? {
        label: `Level ${level}`,
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
    accessorKey: 'code',
    header: 'Code',
    cell: (info) => {
      const code = info.getValue() as string | undefined;
      return code ? (
        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {code}
        </span>
      ) : (
        <span className="text-gray-400 text-xs">-</span>
      );
    },
  },
  {
    accessorKey: 'path',
    header: 'Path',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'parent',
    header: 'Parent',
    accessorFn: (row) => row.parent?.name ?? '-',
    cell: (info) => {
      const name = info.getValue() as string;
      return name !== '-' ? (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {name}
        </span>
      ) : (
        <span className="text-gray-400 text-xs">-</span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: (info) => {
      const isActive = info.getValue() as boolean;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
  {
    id: 'creator',
    header: 'Created By',
    accessorFn: (row) => row.creator?.username ?? '-',
    cell: (info) => (
      <span className="text-sm text-gray-600">{info.getValue() as string}</span>
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
            href={`/dashboard/menu/${item.id}`}
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