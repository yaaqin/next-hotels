import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listPriceProposalProps } from "@/src/models/priceProposal/list";
import { priceProposalList } from "@/src/services/priceProposal/list";

export const usePriceProposalList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<listPriceProposalProps>({
        queryKey: ["price-proposal-list"],
        queryFn: () => priceProposalList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
