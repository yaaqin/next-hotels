import { axiosPrivate } from "@/src/libs/instance"
import { listPriceProposalProps } from "@/src/models/priceProposal/list"

export const priceProposalList = async (): Promise<listPriceProposalProps> => {
  const res = await axiosPrivate.get(`/price-proposals`)

  if (!res) {
    throw new Error('fail to get list price proposal')
  }

  const data = await res.data
  return data
}