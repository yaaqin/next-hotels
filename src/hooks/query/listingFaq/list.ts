import { useQuery } from "@tanstack/react-query";
import { listingFaqListProps } from "@/src/models/listingFaq";
import { listingFaqList } from "@/src/services/listingFaq/admin";

export const useListingFaqList = () => {
    const { data, isLoading, error } = useQuery<listingFaqListProps>({
        queryKey: ["listing-faq-list"],
        queryFn: () => listingFaqList(),
    });

    return { data, isLoading, error };
};
