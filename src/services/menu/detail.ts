import { axiosPrivate } from "@/src/libs/instance"
import { detailMenuProps } from "@/src/models/menu/detail"

export const menuDetail = async (id: string): Promise<detailMenuProps> => {
  const res = await axiosPrivate.get(`/menus/${id}`)

  if (!res) {
    throw new Error('fail to get detail menu')
  }

  const data = await res.data
  return data
}