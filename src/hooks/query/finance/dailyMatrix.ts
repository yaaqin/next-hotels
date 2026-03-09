import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { dailyMatrix } from "@/src/services/finance/dailyMatrix";
import { dailyMatrixProps } from "@/src/models/finance/dailyMatrix";

export const useDailyMatrix = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<dailyMatrixProps>({
        queryKey: ["daily-matrix"],
        queryFn: () => dailyMatrix(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
