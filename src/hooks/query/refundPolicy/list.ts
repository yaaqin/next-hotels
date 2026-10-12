import { useQuery } from "@tanstack/react-query";
import { refundPolicyListProps } from "@/src/models/refundPolicy/list";
import { refundPolicyList } from "@/src/services/refundPolicy/admin";

export const useRefundPolicyList = () => {
    const { data, isLoading, error } = useQuery<refundPolicyListProps>({
        queryKey: ["refund-policy-list"],
        queryFn: () => refundPolicyList(),
    });

    return { data, isLoading, error };
};
