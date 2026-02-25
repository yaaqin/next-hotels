import { axiosPrivate } from "@/src/libs/instance"
import { detailGalleryProps } from "@/src/models/galleries/detail"

export const galleryDetail = async (id: string): Promise<detailGalleryProps> => {
  const res = await axiosPrivate.get(`/galleries/${id}`)

  if (!res) {
    throw new Error('fail to get detail gallery')
  }

  const data = await res.data
  return data
}