import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { roomNumberListProps } from "@/src/models/public/roomAvailibility/listRoomNumber";
import { publicRoomNumberAvailibility } from "@/src/services/roomAvailibility/publicRoomNumberList";

export const usePublicRoomNumberAvailibility = (check_in: string, checkOut: string, typeId: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomNumberListProps>({
        queryKey: ["public-room-number-availibility", check_in, checkOut, typeId],
        queryFn: () => publicRoomNumberAvailibility(check_in, checkOut, typeId),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
