import { useQuery } from "@tanstack/react-query";
import { currencyAdminListProps } from "@/src/models/currency/list";
import { currencyAdminList } from "@/src/services/currency/admin";

export const useCurrencyAdminList = () => {
    const { data, isLoading, error } = useQuery<currencyAdminListProps>({
        queryKey: ["currency-admin-list"],
        queryFn: () => currencyAdminList(),
    });

    return { data, isLoading, error };
};
