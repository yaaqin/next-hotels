import { useQuery } from "@tanstack/react-query";
import { getEnabledFoodPaymentMethods, getEnabledPaymentMethods, PaymentScope } from "@/src/services/paymentMethod/public";

export const useEnabledPaymentMethods = (scope: PaymentScope, siteCode?: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ["public-payment-methods", scope, siteCode],
        queryFn: () => getEnabledPaymentMethods(scope, siteCode!),
        enabled: !!siteCode,
    });

    return { enabledMethods: data?.data ?? [], isLoading };
};

export const useEnabledFoodPaymentMethods = (restaurantSiteId?: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ["public-payment-methods", "FOOD", "restaurant", restaurantSiteId],
        queryFn: () => getEnabledFoodPaymentMethods(restaurantSiteId!),
        enabled: !!restaurantSiteId,
    });

    return { enabledMethods: data?.data ?? [], isLoading };
};
