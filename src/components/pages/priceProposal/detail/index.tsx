'use client'
import Loading from '@/src/components/organisms/loading';
import PriceCalendar from '@/src/components/organisms/priceProposal/customCalendar'
import { usePriceProposalDetail } from '@/src/hooks/query/priceProposal/detail'
import { useParams } from 'next/navigation';

export default function DetailPriceProposalPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = usePriceProposalDetail(id)
  return (
    <div>
      <h4 className='mb-4 text-3xl font-bold'>Detail</h4>
      {isLoading ? (
        <Loading />
      ) : data && (
        <PriceCalendar data={data.data} />
      )}
    </div>
  )
}
