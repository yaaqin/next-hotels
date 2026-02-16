import { axiosPrivate } from "@/src/libs/instance";

export interface DeleteRoomTypeTranslationsPayload {
  langs: string[]; 
}

export const deleteRoomTypeTranslations = async (
  roomTypeId: string,
  payload: DeleteRoomTypeTranslationsPayload
) => {
  const { data } = await axiosPrivate.delete(
    `/room-types/${roomTypeId}/translations`,
    {
      data: payload, 
    }
  );

  return data;
};