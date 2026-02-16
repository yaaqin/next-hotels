import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DetailAllLangProps } from "@/src/models/roomTypes/detailAllLang";
import { roomTypeDetailAllLang } from "@/src/services/roomTypes/detailAllLang";

export const useRoomTypeDetailAllLang = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<DetailAllLangProps>({
        queryKey: ["room-type-detail-all-lang", id],
        queryFn: () => roomTypeDetailAllLang(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
