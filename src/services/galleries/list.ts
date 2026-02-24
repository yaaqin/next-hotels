import { axiosPrivate } from "@/src/libs/instance"
import { galleryListProps } from "@/src/models/galleries/list"

export const galleryList = async (): Promise<galleryListProps> => {
  const res = await axiosPrivate.get(`/galleries`)

  if (!res) {
    throw new Error('fail to get list gallery')
  }

  const data = await res.data
  return data
}