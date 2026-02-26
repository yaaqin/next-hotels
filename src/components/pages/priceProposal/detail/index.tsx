'use client'
import PriceCalendar from '@/src/components/organisms/priceProposal/customCalendar'
import { usePriceProposalDetail } from '@/src/hooks/query/priceProposal/detail'
import { useParams } from 'next/navigation';

export default function DetailPriceProposalPage() {
    const params = useParams<{ id: string }>();
    const id = params.id;

    const {data} = usePriceProposalDetail(id)
  return (
    <div>
        <h4>Detail here</h4>
        {data && (
            <PriceCalendar data={data.data}/>
        )}
    </div>
  )
}
