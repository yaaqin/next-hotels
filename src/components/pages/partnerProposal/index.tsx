'use client'
import { usePartnerProposalList } from '@/src/hooks/query/partnerProposal/list'
import PartnerProposalTable from '../../organisms/partnerProposal/table'
import Link from 'next/link'
import Loading from '../../organisms/loading'
import { useTranslation } from 'react-i18next'

export default function PartnerProposalPage() {
  const { data, isLoading } = usePartnerProposalList()
  const { t } = useTranslation()

  return (
    <div>
      <section className="flex justify-between items-center mb-4">
        <h6 className="text-xl font-semibold">List Partnership Proposal</h6>
        <Link
          href="/dashboard/partner-proposal/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          {t('label.create')}
        </Link>
      </section>

      {isLoading ? (
        <Loading />
      ) : data && (
        <PartnerProposalTable data={data.data} />
      )}
    </div>
  )
}