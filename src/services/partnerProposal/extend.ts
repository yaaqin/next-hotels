import { axiosPrivate } from "@/src/libs/instance"
import { ExtendProposalReq } from "@/src/models/partnerProposal/extend"

export const extendProposal = async ({ id, ...payload }: ExtendProposalReq) => {
  const res = await axiosPrivate.patch(`/partnership-proposal/${id}/extend`, payload)
  return res.data
}
