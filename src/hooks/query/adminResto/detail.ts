import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailAdminRestoProps } from "@/src/models/adminResto/detail";
import { adminRestoDetail } from "@/src/services/adminResto/detail";

export const useAdminRestoDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailAdminRestoProps>({
        queryKey: ["admin-resto-detail", id],
        queryFn: () => adminRestoDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
