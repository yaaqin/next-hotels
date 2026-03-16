import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { refundList } from "@/src/services/refund/list";
import { refundListProps } from "@/src/models/refund/list";

export const useRefundList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<refundListProps>({
        queryKey: ["refund-list"],
        queryFn: () => refundList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
