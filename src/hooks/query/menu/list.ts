import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { menuListProps } from "@/src/models/menu/list";
import { menuList } from "@/src/services/menu/list";

export const useMenuList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<menuListProps>({
        queryKey: ["menu-list", ],
        queryFn: () => menuList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
