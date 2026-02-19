import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailRoomProps } from "@/src/models/room/detail";
import { roomDetail } from "@/src/services/rooms/detail";

export const useRoomDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailRoomProps>({
        queryKey: ["room-detail", id],
        queryFn: () => roomDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
