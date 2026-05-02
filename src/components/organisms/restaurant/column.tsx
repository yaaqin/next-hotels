import { restaurantListState } from '@/src/models/restaurant/list';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export function useRestaurantColumns(): ColumnDef<restaurantListState>[] {
  const { t } = useTranslation();

  return [
    {
      accessorKey: 'id',
      header: t('label.id'),
      cell: (info) => (
        <span className="font-mono text-xs">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: t('label.name'),
      cell: (info) => (
        <span className="font-medium">{info.getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: t('label.description'),
      cell: (info) => (
        <span className="text-gray-600 text-sm">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: t('label.status'),
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isActive ? t('label.active') : t('label.inactive')}
          </span>
        );
      },
    },
    {
      accessorKey: 'ownerships',
      header: t('label.owner'),
      cell: (info) => {
        const ownerships = info.getValue() as restaurantListState['ownerships'];
        if (!ownerships?.length) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-col gap-1">
            {ownerships.map((o) => (
              <span key={o.restaurantAdmin.id} className="text-sm text-gray-700">
                {o.restaurantAdmin.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'restaurantSites',
      header: t('label.site'),
      cell: (info) => {
        const sites = info.getValue() as restaurantListState['restaurantSites'];
        if (!sites?.length) return <span className="text-gray-400">-</span>;
        return (
          <div className="flex flex-col gap-1">
            {sites.map((s) => (
              <span key={s.id} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                {s.site.nama}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('label.createAt'),
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return (
          <span className="text-sm">
            {date.toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: t('label.action'),
      cell: ({ row }) => {
        const resto = row.original;
        return (
          <div className="flex gap-2">
            <Link
              href={`/dashboard/restaurant/${resto.id}`}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {t('label.detail')}
            </Link>
          </div>
        );
      },
    },
  ];
}