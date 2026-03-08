
import { CreatePriceProposalPayload } from "@/src/models/priceProposal/create";
import { createPriceProposal } from "@/src/services/priceProposal/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreatePriceProposal = () => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreatePriceProposalPayload>({
    mutationFn: createPriceProposal,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["price-proposal-list"],
      });
    },
  });
};