import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { bookingDetail } from "@/src/services/bookings/detail";
import { bookingDetailProps } from "@/src/models/bookings/detail";

export const useBookingDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<bookingDetailProps>({
        queryKey: ["booking-detail", id],
        queryFn: () => bookingDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
