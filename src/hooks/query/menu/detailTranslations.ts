import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { menuDetailTranslations } from "@/src/services/menu/detailTranslations";
import { detailMenuTranslationsProps } from "@/src/models/menu/detailTranslations";

export const useMenuDetailTranslations = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailMenuTranslationsProps>({
        queryKey: ["menu-detail-translations", id],
        queryFn: () => menuDetailTranslations(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
