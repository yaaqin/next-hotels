import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { roomTypeDetail } from "@/src/services/roomTypes/detail";
import { detailRoomTypeProps } from "@/src/models/roomTypes/detail";

export const useRoomTypeDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailRoomTypeProps>({
        queryKey: ["room-type-detail", ],
        queryFn: () => roomTypeDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
