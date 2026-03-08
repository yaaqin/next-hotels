import { useQuery } from "@tanstack/react-query";
import { meProps } from "@/src/models/auth/me";
import { getMe } from "@/src/services/auth/me";

export const useMe = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<meProps>({
        queryKey: ["me"],
        queryFn: () => getMe()
    });

    return { data, isLoading, error, refetch };
};
