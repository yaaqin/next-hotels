import { axiosPrivate } from "@/src/libs/instance"
import { DetailPriceProposalProps } from "@/src/models/priceProposal/detail"

export const priceProposalApproval = async (id: string): Promise<DetailPriceProposalProps> => {
  const res = await axiosPrivate.patch(`/price-proposals/${id}/approve`)

  if (!res) {
    throw new Error('fail to approve price Proposal')
  }

  const data = await res.data
  return data
}