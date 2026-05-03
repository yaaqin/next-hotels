import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { menuRestoPublicProps } from "@/src/models/public/menuResto/list";
import { menuRestoPublicList } from "@/src/services/restaurant/restoDashboard/menu/publicList";

export const useMenuRestoPublicList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<menuRestoPublicProps>({
        queryKey: ["menu-resto-public-list"],
        queryFn: () => menuRestoPublicList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
