import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { roomListProps } from "@/src/models/room/list";
import { roomList } from "@/src/services/rooms/list";

export const useRoomList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomListProps>({
        queryKey: ["room-list", ],
        queryFn: () => roomList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
