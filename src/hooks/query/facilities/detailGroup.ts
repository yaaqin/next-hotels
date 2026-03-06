import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailFacilityGroupProps } from "@/src/models/facilities/detailFacilityGroup";
import { facilityGroupDetail } from "@/src/services/facilities/detailGroup";

export const useFacilityGroupDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailFacilityGroupProps>({
        queryKey: ["facility-group-detail", id],
        queryFn: () => facilityGroupDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
