import { sessionTokenLIstState } from '@/src/models/sessionToken/list';
import { ColumnDef } from '@tanstack/react-table';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const sessionTokenColumns: ColumnDef<sessionTokenLIstState>[] = [
  {
    accessorKey: 'id',
    header: 'Session ID',
    cell: (info) => (
      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
        {(info.getValue() as string).slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Login Time',
    cell: (info) => (
      <span className="text-sm text-gray-700">
        {formatDate(info.getValue() as string)}
      </span>
    ),
  },
  {
    accessorKey: 'expiredAt',
    header: 'Expired At',
    cell: (info) => {
      const val = info.getValue() as string | null;
      return (
        <span className="text-sm text-gray-700">
          {val ? formatDate(val) : <span className="text-gray-400">-</span>}
        </span>
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
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
            isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
];