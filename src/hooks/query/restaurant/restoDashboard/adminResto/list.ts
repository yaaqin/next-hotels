import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { adminRestoList } from "@/src/services/restaurant/restoDashboard/adminResto/list";
import { adminRestoListProps } from "@/src/models/restaurant/restoDashboard/adminResto/list";

export const useRestoDataAdminRestoList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<adminRestoListProps>({
        queryKey: ["restodata-admin-list"],
        queryFn: () => adminRestoList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
