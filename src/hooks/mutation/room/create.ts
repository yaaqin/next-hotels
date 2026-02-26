import { CreateRoomReq, CreateRoomRes } from "@/src/models/room/create";
import { createRoom } from "@/src/services/rooms/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateRoomRes, Error, CreateRoomReq>({
    mutationFn: createRoom,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room-list"],
      });
    },
  });
};