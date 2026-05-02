'use client'
import { useParams } from 'next/navigation'
import { usePartnerProposalDetail } from '@/src/hooks/query/partnerProposal/detail'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import Loading from '@/src/components/organisms/loading'

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

const typeColor: Record<string, string> = {
  SUBSCRIPTION: 'bg-blue-100 text-blue-700',
  REVENUE_SHARE: 'bg-purple-100 text-purple-700',
}

const formatIDR = (val: number | null) => {
  if (val === null || val === undefined) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val)
}

export default function PartnerProposalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = usePartnerProposalDetail(id)
  const { t } = useTranslation()

  if (isLoading) return <Loading />
  if (!data?.data) return <div className="text-center py-10 text-gray-500">Data not found</div>

  const proposal = data.data
  const isSubscription = proposal.type === 'SUBSCRIPTION'
  const isRevenueShare = proposal.type === 'REVENUE_SHARE'

  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="flex justify-between items-center">
        <h6 className="text-xl font-semibold">Detail Partnership Proposal</h6>
        <Link
          href="/dashboard/partnership-proposal"
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          {t('label.back')}
        </Link>
      </section>

      {/* Status & Type */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeColor[proposal.type] ?? 'bg-gray-100 text-gray-700'}`}>
            {proposal.type}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[proposal.status] ?? 'bg-gray-100 text-gray-700'}`}>
            {proposal.status}
          </span>
        </div>
      </div>

      {/* Restaurant Site Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Restaurant Site</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Restaurant</p>
            <p className="text-sm font-medium text-gray-800">{proposal.restaurantSite.restaurant.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Site Code</p>
            <p className="text-sm font-mono text-gray-700">{proposal.restaurantSite.siteCode}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Nama Site</p>
            <p className="text-sm text-gray-700">{proposal.restaurantSite.site.nama}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Lokasi</p>
            <p className="text-sm text-gray-700">{proposal.restaurantSite.site.lokasi}</p>
          </div>
        </div>
      </div>

      {/* Proposal Detail */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Proposal Detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Start Date</p>
            <p className="text-sm text-gray-700">
              {new Date(proposal.startDate).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Free Period</p>
            <p className="text-sm text-gray-700">
              {proposal.freePeriodDays ? `${proposal.freePeriodDays} days` : '-'}
            </p>
          </div>

          {/* Subscription Fields */}
          {isSubscription && (
            <>
              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">Flat Fee Monthly</p>
                <p className="text-sm text-gray-700">{formatIDR(proposal.flatFeeMonthly)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">Monthly Cap</p>
                <p className="text-sm text-gray-700">{formatIDR(proposal.monthlyCapIdr)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase mb-1">Surcharge After Cap</p>
                <p className="text-sm text-gray-700">
                  {proposal.surchargeAfterCapPct !== null ? `${proposal.surchargeAfterCapPct}%` : '-'}
                </p>
              </div>
            </>
          )}

          {/* Revenue Share Fields */}
          {isRevenueShare && (
            <div>
              <p className="text-xs text-gray-400 uppercase mb-1">Revenue Share</p>
              <p className="text-sm text-gray-700">
                {proposal.revenueSharePct !== null ? `${proposal.revenueSharePct}%` : '-'}
              </p>
            </div>
          )}

          <div className="md:col-span-2">
            <p className="text-xs text-gray-400 uppercase mb-1">Note</p>
            <p className="text-sm text-gray-700">{proposal.note || '-'}</p>
          </div>
        </div>
      </div>

      {/* Review Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Review Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Reviewer</p>
            <p className="text-sm text-gray-700">{proposal.reviewer?.username ?? '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Reviewed At</p>
            <p className="text-sm text-gray-700">
              {proposal.reviewedAt
                ? new Date(proposal.reviewedAt).toLocaleDateString('id-ID', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                : '-'}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-gray-400 uppercase mb-1">Review Note</p>
            <p className="text-sm text-gray-700">{proposal.reviewNote || '-'}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Meta</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">Created By</p>
            <p className="text-sm text-gray-700">{proposal.creator?.username ?? '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase mb-1">{t('label.createAt')}</p>
            <p className="text-sm text-gray-700">
              {new Date(proposal.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}