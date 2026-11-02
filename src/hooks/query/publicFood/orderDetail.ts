import { useQuery } from "@tanstack/react-query";
import { getFoodOrderDetail } from "@/src/services/publicFood/orderDetail";

// Selama tagihan masih PENDING, status di-polling (webhook DPAY/Midtrans yang mengubahnya di BE)
export const useFoodOrderDetail = (orderId?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["food-order-detail", orderId],
        queryFn: () => getFoodOrderDetail(orderId!),
        enabled: !!orderId,
        refetchInterval: (query) =>
            query.state.data?.data.payment?.status === 'PENDING' ? 5_000 : false,
    });

    return { order: data?.data, isLoading, error };
};
