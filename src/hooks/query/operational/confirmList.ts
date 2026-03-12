import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { needConfirmListProps } from "@/src/models/operational/confirmList";
import { getListConfirm } from "@/src/services/operational/getListConfirm";

export const useNeedConfirmList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<needConfirmListProps>({
        queryKey: ["need-confirm-list"],
        queryFn: () => getListConfirm(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
