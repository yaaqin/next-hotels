import { useQuery } from "@tanstack/react-query";
import { publicRoomAvailibility } from "@/src/services/roomAvailibility/publicRoomTypeList";
import { roomListAvailableProps } from "@/src/models/public/roomAvailibility/listRoomType";

export const usePublicRoomTypeAvailibility = (check_in: string, checkOut: string, siteCode: string) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomListAvailableProps>({
        queryKey: ["public-room-type-availibility", check_in, checkOut, siteCode],
        queryFn: () => publicRoomAvailibility(check_in, checkOut, siteCode),
        enabled: !!check_in && !!checkOut && !!siteCode,
    });

    return { data, isLoading, error, refetch };
};
