import { partnerProposalListState } from '@/src/models/partnerProposal/list'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const typeColor: Record<string, string> = {
  SUBSCRIPTION: 'bg-blue-100 text-blue-700',
  REVENUE_SHARE: 'bg-purple-100 text-purple-700',
}

export function usePartnerProposalColumns(): ColumnDef<partnerProposalListState>[] {
  const { t } = useTranslation()

  return [
    {
      accessorKey: 'restaurantSite',
      header: 'Restaurant',
      cell: (info) => {
        const site = info.getValue() as partnerProposalListState['restaurantSite']
        return (
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-sm">{site.restaurant.name}</span>
            <span className="text-xs text-gray-400 font-mono">{site.siteCode}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: (info) => {
        const type = info.getValue() as string
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor[type] ?? 'bg-gray-100 text-gray-700'}`}>
            {type}
          </span>
        )
      },
    },
    {
      accessorKey: 'status',
      header: t('label.status'),
      cell: (info) => {
        const status = info.getValue() as string
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[status] ?? 'bg-gray-100 text-gray-700'}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {new Date(info.getValue() as string).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      accessorKey: 'creator',
      header: t('label.createBy'),
      cell: (info) => {
        const creator = info.getValue() as partnerProposalListState['creator']
        return <span className="text-sm text-gray-600">{creator?.username ?? '-'}</span>
      },
    },
    {
      accessorKey: 'reviewer',
      header: 'Reviewer',
      cell: (info) => {
        const reviewer = info.getValue() as partnerProposalListState['reviewer']
        return <span className="text-sm text-gray-600">{reviewer?.username ?? '-'}</span>
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('label.createAt'),
      cell: (info) => (
        <span className="text-sm text-gray-600">
          {new Date(info.getValue() as string).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('label.action'),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/partner-proposal/${row.original.id}`}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1 w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {t('label.detail')}
        </Link>
      ),
    },
  ]
}