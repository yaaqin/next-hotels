import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { restoList } from "@/src/services/restaurant/list";
import { restaurantListProps } from "@/src/models/restaurant/list";

export const useRestoList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<restaurantListProps>({
        queryKey: ["resto-list"],
        queryFn: () => restoList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
