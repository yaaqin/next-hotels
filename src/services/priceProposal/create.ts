import { axiosPrivate } from "@/src/libs/instance";
import { CreatePriceProposalPayload } from "@/src/models/priceProposal/create";

export const createPriceProposal = async (payload: CreatePriceProposalPayload) => {
  const res = await axiosPrivate.post("/price-proposals", payload);
  return res.data;
};