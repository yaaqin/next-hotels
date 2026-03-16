'use client'
import { useRefundList } from '@/src/hooks/query/refund/list'
import RefundTable from '../../organisms/refund/table'
import { refundListState } from '@/src/models/refund/list'
import { useApproveRefund } from '@/src/hooks/mutation/refund/approve'

export default function RefundPage() {
  const { data } = useRefundList()

  const { mutate: approve, isPending: isApproving } = useApproveRefund()

  const handleApprove = (refund: refundListState) => {
    approve(refund.booking.bookingCode, {
      onSuccess: () => {
        setSelectedRefund(null)
      },
      onError: () => {
        alert('Gagal approve refund, silakan coba lagi')
      },
    })
  }
  return (
    <RefundTable data={data?.data?.refunds ?? []} />
  )
}
