import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { facilityGroupListProps } from "@/src/models/facilities/listGroups";
import { facilityGroupList } from "@/src/services/facilities/listGroups";

export const useFacilityGroupList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<facilityGroupListProps>({
        queryKey: ["facility-group-list"],
        queryFn: () => facilityGroupList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
