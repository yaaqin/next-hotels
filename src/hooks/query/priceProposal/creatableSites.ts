import { useQuery } from "@tanstack/react-query";
import { creatableSitesProps } from "@/src/models/priceProposal/creatableSites";
import { priceProposalCreatableSites } from "@/src/services/priceProposal/creatableSites";

export const usePriceProposalCreatableSites = () => {
    const { data, isLoading, error } = useQuery<creatableSitesProps>({
        queryKey: ["price-proposal-creatable-sites"],
        queryFn: () => priceProposalCreatableSites(),
        retry: false,
    });

    return { data, isLoading, error };
};
