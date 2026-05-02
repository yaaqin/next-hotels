import { CreateProposalReq, CreateProposalRes } from "@/src/models/partnerProposal/create"
import { createProposal } from "@/src/services/partnerProposal/create"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateProposal = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateProposalRes, Error, CreateProposalReq>({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal-list"] })
    },
  })
}