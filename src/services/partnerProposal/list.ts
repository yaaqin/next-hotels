import { axiosPrivate } from "@/src/libs/instance"
import { partnerProposalListProps } from "@/src/models/partnerProposal/list"

export const partnerProposalList = async (): Promise<partnerProposalListProps> => {
  const res = await axiosPrivate.get(`/partnership-proposal`)

  if (!res) {
    throw new Error('fail to get list partner proposal')
  }

  const data = await res.data
  return data
}