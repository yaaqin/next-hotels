import { useQuery } from "@tanstack/react-query";
import { roomNumberListProps } from "@/src/models/public/roomAvailibility/listRoomNumber";
import { publicRoomNumberAvailibility } from "@/src/services/roomAvailibility/publicRoomNumberList";

export const usePublicRoomNumberAvailibility = (check_in: string, checkOut: string, typeId: string) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomNumberListProps>({
        queryKey: ["public-room-number-availibility", check_in, checkOut, typeId],
        queryFn: () => publicRoomNumberAvailibility(check_in, checkOut, typeId),
        // Store booking di-reset setelah submit → tanggal kosong, jangan fetch (BE balas 400)
        enabled: !!check_in && !!checkOut && !!typeId,
    });

    return { data, isLoading, error, refetch };
};
