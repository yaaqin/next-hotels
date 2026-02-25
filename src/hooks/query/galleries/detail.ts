import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailGalleryProps } from "@/src/models/galleries/detail";
import { galleryDetail } from "@/src/services/galleries/detail";

export const useGalleryDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailGalleryProps>({
        queryKey: ["gallery-detail", id],
        queryFn: () => galleryDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
