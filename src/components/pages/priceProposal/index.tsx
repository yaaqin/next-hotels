'use client'
import { usePriceProposalList } from '@/src/hooks/query/priceProposal/list'

export default function PriceProposalPage() {
    const {data} = usePriceProposalList()

    console.log('data proposal here ==>', data)
  return (
    <div>
      list here
    </div>
  )
}
