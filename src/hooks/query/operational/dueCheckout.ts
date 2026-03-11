import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getListDueCheckout } from "@/src/services/operational/getListDueCheckOut";
import { dueCHeckOutProps } from "@/src/models/operational/dueCheckOut";

export const useDueCheckOutList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<dueCHeckOutProps>({
        queryKey: ["checkout-due-list",],
        queryFn: () => getListDueCheckout(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
