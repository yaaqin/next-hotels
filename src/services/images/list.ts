import { axiosPrivate } from "@/src/libs/instance"
import { ImagesListProps } from "@/src/models/images/list"

export const imageList = async (): Promise<ImagesListProps> => {
  const res = await axiosPrivate.get(`/images`)

  if (!res) {
    throw new Error('fail to get list images')
  }

  const data = await res.data
  return data
}