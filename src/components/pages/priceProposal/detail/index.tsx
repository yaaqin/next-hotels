'use client'
import Buttons from '@/src/components/atoms/buttons';
import Loading from '@/src/components/organisms/loading';
import PriceCalendar from '@/src/components/organisms/priceProposal/customCalendar'
import { useApprovePriceProposal } from '@/src/hooks/mutation/priceProposal/approve';
import { useMe } from '@/src/hooks/query/auth/me';
import { usePriceProposalDetail } from '@/src/hooks/query/priceProposal/detail'
import { useParams } from 'next/navigation';

export default function DetailPriceProposalPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isLoading } = usePriceProposalDetail(id)
  const { data: myData } = useMe()
  const { mutate, isPending } = useApprovePriceProposal()

  const handleApprove = () => {
    mutate(id)
  }

  return (
    <div>
      <h4 className='mb-4 text-2xl font-semibold'>Detail</h4>
      {isLoading ? (
        <Loading />
      ) : data && (
        <PriceCalendar data={data.data} />
      )}
      <section className='w-full flex py-4 px-6 justify-end'>
        {(myData?.data?.role === 'SUPERADMIN' || myData?.data?.role === 'OWNER') && data?.data.status === "DRAFT" && (
          <Buttons
            label={isPending ? "Approve data..." : "Approve"}
            onClick={handleApprove}
            disable={isPending}
            className="border-0 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
          />
        )}
      </section>
    </div>
  )
}
