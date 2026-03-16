import { userProfileProps } from "@/src/models/public/userProfile";
import { userProfile } from "@/src/services/userProfile";
import { useQuery } from "@tanstack/react-query";

export const useUserProfile = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<userProfileProps>({
        queryKey: ["user-profile"],
        queryFn: () => userProfile(),
    });

    return { data, isLoading, error, refetch };
};
