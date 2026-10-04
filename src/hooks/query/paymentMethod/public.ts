import { useQuery } from "@tanstack/react-query";
import { getEnabledPaymentMethods, PaymentScope } from "@/src/services/paymentMethod/public";

export const useEnabledPaymentMethods = (scope: PaymentScope, siteCode?: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ["public-payment-methods", scope, siteCode],
        queryFn: () => getEnabledPaymentMethods(scope, siteCode!),
        enabled: !!siteCode,
    });

    return { enabledMethods: data?.data ?? [], isLoading };
};
