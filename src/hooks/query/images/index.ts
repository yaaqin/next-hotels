import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ImagesListProps } from "@/src/models/images/list";
import { imageList } from "@/src/services/images/list";

export const useImageList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<ImagesListProps>({
        queryKey: ["images-list", ],
        queryFn: () => imageList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
