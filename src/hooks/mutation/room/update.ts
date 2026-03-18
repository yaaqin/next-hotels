// hooks/rooms/useUpdateRoom.ts
import { UpdateRoomReq, UpdateRoomRes } from "@/src/models/room/update";
import { updateRoom } from "@/src/services/rooms/update";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRoom = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateRoomRes, Error, UpdateRoomReq>({
    mutationFn: updateRoom,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["room", id],
      });
    },
  });
};