import { axiosPrivate } from "@/src/libs/instance"
import { menuListProps } from "@/src/models/menu/list"

export const menuList = async (): Promise<menuListProps> => {
  const res = await axiosPrivate.get(`/menus`)

  if (!res) {
    throw new Error('fail to get list menu')
  }

  const data = await res.data
  return data
}