import { axiosPrivate } from "@/src/libs/instance"
import { menuListProps } from "@/src/models/menu/list"

// Menu sidebar dashboard sesuai access control role admin yang login.
// Daftar semua menu (kelola menu) ada di /config/menus — lihat services/config.
export const menuList = async (): Promise<menuListProps> => {
  const res = await axiosPrivate.get(`/me/menus`)

  if (!res) {
    throw new Error('fail to get list menu')
  }

  const data = await res.data
  return data
}