import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { menuRestoProps } from "@/src/models/restaurant/restoDashboard/menu/list";
import { menuRestoList } from "@/src/services/restaurant/restoDashboard/menu/list";

export const useMenuRestoList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<menuRestoProps>({
        queryKey: ["menu-resto-list"],
        queryFn: () => menuRestoList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
