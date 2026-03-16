import { userCreditHistoryProps } from "@/src/models/public/userProfile/creditHistory";
import { userCreditHistory } from "@/src/services/userProfile/creditHistory";
import { useQuery } from "@tanstack/react-query";

export const useUserCreditHistory = () => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<userCreditHistoryProps>({
        queryKey: ["user-credit-history"],
        queryFn: () => userCreditHistory(),
    });

    return { data, isLoading, error, refetch };
};
