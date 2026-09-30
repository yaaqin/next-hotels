import { useQuery } from "@tanstack/react-query";
import { reschedulePolicyListProps } from "@/src/models/reschedulePolicy/list";
import { reschedulePolicyList } from "@/src/services/reschedulePolicy/admin";

export const useReschedulePolicyList = () => {
    const { data, isLoading, error } = useQuery<reschedulePolicyListProps>({
        queryKey: ["reschedule-policy-list"],
        queryFn: () => reschedulePolicyList(),
    });

    return { data, isLoading, error };
};
