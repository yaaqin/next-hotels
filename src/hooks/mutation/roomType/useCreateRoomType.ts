import { createRoomType, CreateRoomTypePayload } from "@/src/services/roomTypes/create";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      lang,
    }: {
      payload: CreateRoomTypePayload;
      lang: string;
    }) => createRoomType(payload, lang),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["room-types"],
      });
    },
  });
};