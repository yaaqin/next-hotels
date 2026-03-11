import { axiosPrivate } from "@/src/libs/instance"
import { needConfirmListProps } from "@/src/models/operational/confirmList"

export const getListConfirm = async (): Promise<needConfirmListProps> => {
  const res = await axiosPrivate.get(`/operational/need-confirm`)

  if (!res) {
    throw new Error('fail to get list transaction need confirm')
  }

  const data = await res.data
  return data
}