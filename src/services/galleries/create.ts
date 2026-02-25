import { axiosPrivate } from "@/src/libs/instance";

export interface CreateGalleryPayload {
  title: string;
  imageIds: string[];
}

export const createGallery = async (payload: CreateGalleryPayload) => {
  const { data } = await axiosPrivate.post("/galleries", payload);
  return data;
};