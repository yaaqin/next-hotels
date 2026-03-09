import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { bookingHistoryListProps } from "@/src/models/public/bookingHistory/list";
import { bookingHistoryList } from "@/src/services/bookingHistory/list";

export const useBookingHistoryList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<bookingHistoryListProps>({
        queryKey: ["booking-history"],
        queryFn: () => bookingHistoryList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
