import { axiosPrivate } from "@/src/libs/instance"
import { DetailPriceProposalProps } from "@/src/models/priceProposal/detail"

export const priceProposalDetail = async (id: string): Promise<DetailPriceProposalProps> => {
  const res = await axiosPrivate.get(`/price-proposals/${id}`)

  if (!res) {
    throw new Error('fail to get detail pice proposal')
  }

  const data = await res.data
  return data
}