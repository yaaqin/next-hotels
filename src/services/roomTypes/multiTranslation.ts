import { axiosPrivate } from "@/src/libs/instance";
import { MultiTranslationPayload, MultiTranslationResponse } from "@/src/models/roomTypes/updateMultiTranslation";

export const multiRoomTypeTranslation = async (
  roomTypeId: string,
  payload: MultiTranslationPayload
): Promise<MultiTranslationResponse> => {
  const { data } = await axiosPrivate.post(
    `/room-types/${roomTypeId}/multi-translation`,
    payload
  );

  return data;
};
