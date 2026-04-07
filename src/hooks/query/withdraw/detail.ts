import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { WithdrawDetail } from "@/src/services/withdraw/detail";
import { detailWdProps } from "@/src/models/withdraw/detail";

export const useWithdrawDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailWdProps>({
        queryKey: ["user-detail", id],
        queryFn: () => WithdrawDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
