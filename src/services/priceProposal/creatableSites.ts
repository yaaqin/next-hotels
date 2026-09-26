import { axiosPrivate } from "@/src/libs/instance"
import { creatableSitesProps } from "@/src/models/priceProposal/creatableSites"

export const priceProposalCreatableSites = async (): Promise<creatableSitesProps> => {
  const res = await axiosPrivate.get(`/price-proposals/creatable-sites`)
  return res.data
}
