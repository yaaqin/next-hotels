import { axiosPrivate } from "@/src/libs/instance"
import { detailMenuTranslationsProps } from "@/src/models/menu/detailTranslations"

export const menuDetailTranslations = async (id: string): Promise<detailMenuTranslationsProps> => {
  const res = await axiosPrivate.get(`/menus/${id}/translations`)

  if (!res) {
    throw new Error('fail to get detail menu transalations')
  }

  const data = await res.data
  return data
}