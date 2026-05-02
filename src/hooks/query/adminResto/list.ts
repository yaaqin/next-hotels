import { useQuery } from "@tanstack/react-query";
import { AdminRestoList } from "@/src/services/adminResto/list";
import { adminRestoListProps } from "@/src/models/adminResto/list";

export const useAdminRestoList = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<adminRestoListProps>({
        queryKey: ["admin-resto-list"],
        queryFn: () => AdminRestoList(),
    });

    return { data, isLoading, error, refetch };
};
