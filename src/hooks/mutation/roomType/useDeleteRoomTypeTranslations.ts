import { deleteRoomTypeTranslations, DeleteRoomTypeTranslationsPayload } from "@/src/services/roomTypes/deleteTranslation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface Variables {
  roomTypeId: string;
  payload: DeleteRoomTypeTranslationsPayload;
}

export const useDeleteRoomTypeTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomTypeId, payload }: Variables) =>
      deleteRoomTypeTranslations(roomTypeId, payload),

    onSuccess: (_, variables) => {
      // refetch detail all lang
      queryClient.invalidateQueries({
        queryKey: ["room-type-detail-all-lang", variables.roomTypeId],
      });
    },
  });
};
