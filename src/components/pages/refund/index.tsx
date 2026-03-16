'use client'
import { useRefundList } from '@/src/hooks/query/refund/list'
import RefundTable from '../../organisms/refund/table'

export default function RefundPage() {
  const { data } = useRefundList()
  return (
    <RefundTable data={data?.data?.refunds ?? []} />
  )
}
