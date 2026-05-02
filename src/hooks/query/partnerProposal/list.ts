import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { partnerProposalListProps } from "@/src/models/partnerProposal/list";
import { partnerProposalList } from "@/src/services/partnerProposal/list";

export const usePartnerProposalList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<partnerProposalListProps>({
        queryKey: ["partner-proposal-list"],
        queryFn: () => partnerProposalList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
