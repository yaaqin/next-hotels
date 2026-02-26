import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { priceProposalDetail } from "@/src/services/priceProposal/detail";
import { DetailPriceProposalProps } from "@/src/models/priceProposal/detail";

export const usePriceProposalDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<DetailPriceProposalProps>({
        queryKey: ["price-proposal-detail", id],
        queryFn: () => priceProposalDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
