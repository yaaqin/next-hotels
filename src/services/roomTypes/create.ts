import { axiosPrivate } from "@/src/libs/instance";

export interface CreateRoomTypePayload {
  name: string;
  desk: string;
}

export const createRoomType = async (
  payload: CreateRoomTypePayload,
  lang: string
) => {
  const { data } = await axiosPrivate.post(
    "/room-types",
    payload,
    {
      headers: {
        "x-lang": lang,
      },
    }
  );

  return data;
};