import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRescheduleAvailableDates } from "@/src/services/reschedule/reschAvlbDate";
import { rechAvlbDateProps } from "@/src/models/reschedule/rescAvlbDate";

export const useReschAvlbDate = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<rechAvlbDateProps>({
        queryKey: ["reschedule-available-dates", id],
        queryFn: () => getRescheduleAvailableDates(id),
        enabled: !!id,
    });

    return { data, isLoading, error, refetch };
};
