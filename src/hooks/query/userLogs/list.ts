import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userLogs } from "@/src/services/userLogs/list";
import { userLogsProps } from "@/src/models/userLogs/list";

export const useUserLogs = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<userLogsProps>({
        queryKey: ["site-list", ],
        queryFn: () => userLogs(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
