import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { publicRoomAvailibility } from "@/src/services/roomAvailibility/publicRoomTypeList";
import { roomListAvailableProps } from "@/src/models/public/roomAvailibility/listRoomType";

export const usePublicRoomTypeAvailibility = (check_in: string, checkOut: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomListAvailableProps>({
        queryKey: ["public-room-type-availibility", check_in, checkOut],
        queryFn: () => publicRoomAvailibility(check_in, checkOut),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
