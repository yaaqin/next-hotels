import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { facilityItemList } from "@/src/services/facilities/listItems";
import { facilityItemslistProps } from "@/src/models/facilities/listitems";

export const useFacilityItemList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<facilityItemslistProps>({
        queryKey: ["facility-item-list", ],
        queryFn: () => facilityItemList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
