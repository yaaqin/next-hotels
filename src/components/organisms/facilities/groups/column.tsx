import { facilityGroupListState } from '@/src/models/facilities/listGroups';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const truncateFacilities = (facilities: facilityGroupListState['facility'], lang: string = 'en') => {
  const names = facilities.map(f => {
    const t = f.translations.find(t => t.lang === lang) ?? f.translations[0];
    return t?.name ?? f.code;
  }).join(', ');

  return names.length > 20 ? names.slice(0, 20) + '...' : names;
};

export const facilityGroupColumns: ColumnDef<facilityGroupListState>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-xs text-gray-500">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'code',
    header: 'Code',
    cell: (info) => (
      <span className="font-semibold text-gray-800 uppercase">{info.getValue() as string}</span>
    ),
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: (info) => (
      <span className="text-sm text-gray-600">{(info.getValue() as string) || '-'}</span>
    ),
  },
  {
    id: 'facility',
    header: 'Facility',
    cell: ({ row }) => {
      const facilities = row.original.facility;
      const display = truncateFacilities(facilities);
      const full = facilities.map(f => f.translations[0]?.name ?? f.code).join(', ');

      return (
        <span
          className="text-sm text-gray-700"
          title={full}
        >
          {facilities.length === 0 ? '-' : display}
        </span>
      );
    },
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
            href={`/dashboard/facility/group/${item.id}`}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detail
          </Link>
        </div>
      );
    },
  },
];