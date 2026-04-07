import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { withdrawList } from "@/src/services/withdraw/list";
import { withdrawListProps } from "@/src/models/withdraw/list";

export const useWithdrawList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<withdrawListProps>({
        queryKey: ["withdraw-list"],
        queryFn: () => withdrawList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
