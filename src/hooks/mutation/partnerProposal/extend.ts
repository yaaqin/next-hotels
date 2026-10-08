import { ExtendProposalReq, ExtendProposalRes } from "@/src/models/partnerProposal/extend"
import { extendProposal } from "@/src/services/partnerProposal/extend"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useExtendProposal = () => {
  const queryClient = useQueryClient()

  return useMutation<ExtendProposalRes, Error, ExtendProposalReq>({
    mutationFn: extendProposal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["partner-proposal-list"] })
      queryClient.invalidateQueries({ queryKey: ["partner-proposal-detail", id] })
    },
  })
}
