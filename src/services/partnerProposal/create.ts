import { axiosPrivate } from "@/src/libs/instance"
import { CreateProposalReq } from "@/src/models/partnerProposal/create"

export const createProposal = async (payload: CreateProposalReq) => {
  const res = await axiosPrivate.post("/partnership-proposal", payload)
  return res.data
}