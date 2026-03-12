import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { recentActivityList } from "@/src/services/userRecentActivity/list";
import { userRecentActivityListProps } from "@/src/models/userRecentActivity/list";

export const useRecentActivity = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<userRecentActivityListProps>({
        queryKey: ["recent-activity-list"],
        queryFn: () => recentActivityList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
