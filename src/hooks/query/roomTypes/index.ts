import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { roomTypeLIstProps } from "@/src/models/roomTypes/list";
import { roomTypeList } from "@/src/services/roomTypes/list";

export const useRoomTypeList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomTypeLIstProps>({
        queryKey: ["room-type-list"],
        queryFn: () => roomTypeList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
