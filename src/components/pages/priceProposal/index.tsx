'use client'
import { usePriceProposalList } from '@/src/hooks/query/priceProposal/list'
import PriceProposalTable from '../../organisms/priceProposal/tableList'
import Link from 'next/link'
import Loading from '../../organisms/loading'

export default function PriceProposalPage() {
    const { data, isLoading } = usePriceProposalList()
    return (
        <div>
            <section className='flex items-center justify-between'>
                <h5 className='mb-4 text-3xl font-bold'>
                    Price Proposal
                </h5>
                <Link href={`/dashboard/price-proposal/create`} className='p-2 px-6'>Create</Link>
            </section>
            {isLoading ? (
                <Loading />
            ) : data && (
                <PriceProposalTable data={data.data} />
            )}
        </div>
    )
}
