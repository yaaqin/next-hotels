import { useQuery } from "@tanstack/react-query";
import { roomListProps } from "@/src/models/room/list";
import { roomList } from "@/src/services/rooms/list";

export const useRoomList = (roomType?: string) => {
    const { data, isLoading, error, refetch } = useQuery<roomListProps>({
        queryKey: ["room-list", roomType],
        queryFn: () => roomList({ roomType }),
    });

    return { data, isLoading, error, refetch };
};