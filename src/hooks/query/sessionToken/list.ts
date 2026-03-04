import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sessionTokenList } from "@/src/services/sessionToken/list";
import { sessionTokenLIstProps } from "@/src/models/sessionToken/list";

export const useSessionTokenList = () => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<sessionTokenLIstProps>({
        queryKey: ["session-token-list"],
        queryFn: () => sessionTokenList(page),
        enabled: !!page,
    });

    return { data, isLoading, error, refetch };
};
