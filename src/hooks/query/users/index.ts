import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userList } from "@/src/services/users/list";
import { userListProps } from "@/src/models/users/list";

export const useUserList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<userListProps>({
        queryKey: ["user-list", ],
        queryFn: () => userList(),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
