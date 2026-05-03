import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { restoBranchList } from "@/src/services/restaurant/restoDashboard/branch/list";
import { BranchRestoListProps } from "@/src/models/restaurant/restoDashboard/branch/list";

export const useRestoBranchList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<BranchRestoListProps>({
        queryKey: ["resto-branch-list"],
        queryFn: () => restoBranchList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
