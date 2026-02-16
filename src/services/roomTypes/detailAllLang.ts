import { axiosPrivate } from "@/src/libs/instance"
import { DetailAllLangProps } from "@/src/models/roomTypes/detailAllLang"

export const roomTypeDetailAllLang = async (id: string): Promise<DetailAllLangProps> => {
  const res = await axiosPrivate.get(`/room-types/${id}/translations`)

  if (!res) {
    throw new Error('fail to get detail room type with all lang')
  }

  const data = await res.data
  return data
}