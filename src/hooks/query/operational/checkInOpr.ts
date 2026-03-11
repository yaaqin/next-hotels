import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getListCheckInOpr } from "@/src/services/operational/getListCheckIn";
import { checkinOprProps } from "@/src/models/operational/checkinList";

export const useCheckInOprList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<checkinOprProps>({
        queryKey: ["checkin-operational-list",],
        queryFn: () => getListCheckInOpr(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
