import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { roomPlanListProps } from "@/src/models/public/roomPlan/list";
import { publicRoomPlanList } from "@/src/services/roomPlan/list";

export const usePublicRoomPlan = (siteCode: string, check_in: string, checkOut: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<roomPlanListProps>({
        queryKey: ["public-room-plan", siteCode, check_in, checkOut],
        queryFn: () => publicRoomPlanList(siteCode, check_in, checkOut),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
