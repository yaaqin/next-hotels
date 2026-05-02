import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailPartnerProposalProps } from "@/src/models/partnerProposal/detail";
import { partnerProposalDetail } from "@/src/services/partnerProposal/detail";

export const usePartnerProposalDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailPartnerProposalProps>({
        queryKey: ["partner-proposal-detail", id],
        queryFn: () => partnerProposalDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
