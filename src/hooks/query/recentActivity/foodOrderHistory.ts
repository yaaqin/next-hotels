import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { orderFoodHistoryProps } from "@/src/models/public/food/orderHistory";
import { foodOrderHistoryList } from "@/src/services/publicFood/orderHistory";

export const useFoodOrderHistory = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<orderFoodHistoryProps>({
        queryKey: ["food-order-history-list"],
        queryFn: () => foodOrderHistoryList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
