import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { detailUserProps } from "@/src/models/users/detail";
import { userDetail } from "@/src/services/users/detail";

export const useUserDetail = (id: string) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<detailUserProps>({
        queryKey: ["user-detail", id],
        queryFn: () => userDetail(id),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
