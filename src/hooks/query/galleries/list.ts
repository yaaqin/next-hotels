import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { galleryListProps } from "@/src/models/galleries/list";
import { galleryList } from "@/src/services/galleries/list";

export const useGalleryList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<galleryListProps>({
        queryKey: ["gallery-list"],
        queryFn: () => galleryList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
