import { useMutation } from "@tanstack/react-query";
import { multiRoomTypeTranslation } from "@/src/services/roomTypes/multiTranslation";
import { MultiTranslationPayload } from "@/src/models/roomTypes/updateMultiTranslation";

export const useMultiRoomTypeTranslation = (roomTypeId: string) => {
  return useMutation({
    mutationFn: (payload: MultiTranslationPayload) =>
      multiRoomTypeTranslation(roomTypeId, payload),
  });
};