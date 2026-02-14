import { sitelistProps } from "@/src/models/sites/list";
import { siteList } from "@/src/services/sites/list";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export const useSiteList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<sitelistProps>({
        queryKey: ["site-list", ],
        queryFn: () => siteList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
