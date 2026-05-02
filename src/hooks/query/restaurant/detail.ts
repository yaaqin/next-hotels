import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailRestoProps } from "@/src/models/restaurant/detail";
import { restoDetail } from "@/src/services/restaurant/detail";

export const useRestoDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailRestoProps>({
        queryKey: ["resto-detail", id],
        queryFn: () => restoDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
