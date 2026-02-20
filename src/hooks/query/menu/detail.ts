import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailMenuProps } from "@/src/models/menu/detail";
import { menuDetail } from "@/src/services/menu/detail";

export const useMenuDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailMenuProps>({
        queryKey: ["menu-detail", id],
        queryFn: () => menuDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
