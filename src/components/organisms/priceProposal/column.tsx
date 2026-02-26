import { listPriceProposalState } from '@/src/models/priceProposal/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const STATUS_STYLE: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  REVIEWED: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

export const priceProposalColumns: ColumnDef<listPriceProposalState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-400 truncate max-w-[80px] block">
        {(info.getValue() as string).slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Name',
    cell: (info) => {
      const row = info.row.original;
      return (
        <div>
          <p className="font-semibold text-gray-800 text-sm">{info.getValue() as string}</p>
          {row.description && (
            <p className="text-xs text-gray-400 truncate max-w-[200px]">{row.description}</p>
          )}
        </div>
      );
    },
  },
  {
    id: 'period',
    header: 'Periode',
    accessorFn: (row) => row.startDate,
    cell: (info) => {
      const row = info.row.original;
      const fmt = (d: string) =>
        new Date(d).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      return (
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {fmt(row.startDate)} — {fmt(row.endDate)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue() as string;
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
            STATUS_STYLE[status] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {status}
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
            href={`/dashboard/price-proposal/${item.id}`}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detail
          </Link>
        </div>
      );
    },
  },
];