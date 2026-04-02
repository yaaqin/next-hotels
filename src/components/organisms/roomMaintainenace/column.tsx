import { roomMaintainenaceListState } from '@/src/models/roomMaintenance/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const priorityBadge = (priority: string) => {
  const map: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-700 border border-red-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    LOW: 'bg-green-100 text-green-700 border border-green-200',
  };
  return map[priority?.toUpperCase()] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
};

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    IN_PROGRESS: 'bg-blue-100 text-blue-700 border border-blue-200',
    COMPLETED: 'bg-green-100 text-green-700 border border-green-200',
    CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
    REVIEWED: 'bg-purple-100 text-purple-700 border border-purple-200',
  };
  return map[status?.toUpperCase()] ?? 'bg-gray-100 text-gray-600 border border-gray-200';
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const roomMaintenanceColumns: ColumnDef<roomMaintainenaceListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    id: 'room',
    header: 'Room',
    accessorFn: (row) => row.room?.number ?? '-',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-blue-700">{row.original.room?.number ?? '-'}</span>
        <span className="text-xs text-gray-400">{row.original.room?.siteCode ?? '-'}</span>
      </div>
    ),
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: (info) => (
      <span className="text-gray-700">{formatDate(info.getValue() as string)}</span>
    ),
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: (info) => (
      <span className="text-gray-700">{formatDate(info.getValue() as string)}</span>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge(value)}`}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(value)}`}>
          {value}
        </span>
      );
    },
  },
  {
    id: 'requester',
    header: 'Requested By',
    accessorFn: (row) => row.requester?.username ?? '-',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-gray-700">{row.original.requester?.username ?? '-'}</span>
        <span className="text-xs text-gray-400">{formatDate(row.original.requestedAt)}</span>
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <Link
        href={`/dashboard/room-maintenance/${row.original.id}`}
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