import { CreateRoomMaintenanceReq, CreateRoomMaintenanceRes } from "@/src/models/roomMaintenance/create";
import { createRoomMaintenance } from "@/src/services/roomMaintainenace/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateRoomMaintenance = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<CreateRoomMaintenanceRes, Error, CreateRoomMaintenanceReq>({
        mutationFn: createRoomMaintenance,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["room-list-maintain"],
            });
            router.push("/dashboard/room-maintenance");
        },
    });
};