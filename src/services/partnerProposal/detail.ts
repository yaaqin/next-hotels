import { axiosPrivate } from "@/src/libs/instance"
import { detailPartnerProposalProps } from "@/src/models/partnerProposal/detail"

export const partnerProposalDetail = async (id: string): Promise<detailPartnerProposalProps> => {
  const res = await axiosPrivate.get(`/partnership-proposal/${id}`)

  if (!res) {
    throw new Error('fail to get detail partner proposal')
  }

  const data = await res.data
  return data
}