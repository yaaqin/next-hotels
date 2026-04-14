import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailUserLogProps } from "@/src/models/userLogs/detail";
import { userLogDetail } from "@/src/services/userLogs/detail";

export const useUserLogDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailUserLogProps>({
        queryKey: ["user-log-detail", id],
        queryFn: () => userLogDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
