import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { bookingList } from "@/src/services/bookings/list";
import { bookingListProps } from "@/src/models/bookings/list";

export const useBookingList = (date: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<bookingListProps>({
        queryKey: ["booking-list", date],
        queryFn: () => bookingList(date),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
