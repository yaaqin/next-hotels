'use client'
import { usePriceProposalList } from '@/src/hooks/query/priceProposal/list'
import PriceProposalTable from '../../organisms/priceProposal/tableList'

export default function PriceProposalPage() {
    const { data } = usePriceProposalList()

    console.log('data proposal here ==>', data)
    return (
        <div>
            <h5 className='mb-4'>
                list here
            </h5>
            {data && (
                <PriceProposalTable data={data.data} />
            )}
        </div>
    )
}
