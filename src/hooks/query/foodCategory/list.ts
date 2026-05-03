import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { foodCategoryListProps } from "@/src/models/foodCategory/list";
import { foodCategoryList } from "@/src/services/foodCategory/list";

export const useFoodCategoryList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<foodCategoryListProps>({
        queryKey: ["food-category-list", ],
        queryFn: () => foodCategoryList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
