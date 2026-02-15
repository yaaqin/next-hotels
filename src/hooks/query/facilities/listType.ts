import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { facilityTypeList } from "@/src/services/facilities/listType";
import { facilitytTypeProps } from "@/src/models/facilities/listType";

export const useFacilityTypeList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<facilitytTypeProps>({
        queryKey: ["facility-type-list", ],
        queryFn: () => facilityTypeList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
