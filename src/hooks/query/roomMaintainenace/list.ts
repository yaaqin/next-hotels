import { useQuery } from "@tanstack/react-query";
import { roomMaintainList } from "@/src/services/roomMaintainenace/list";
import { roomMaintainenaceListProps } from "@/src/models/roomMaintenance/list";

export const useRoomMaintainList = () => {
    const { data, isLoading, error, refetch } = useQuery<roomMaintainenaceListProps>({
        queryKey: ["room-list-maintain"],
        queryFn: () => roomMaintainList(),
    });

    return { data, isLoading, error, refetch };
};