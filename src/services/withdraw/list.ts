import { axiosPrivate } from "@/src/libs/instance"
import { withdrawListProps } from "@/src/models/withdraw/list"

export const withdrawList = async (): Promise<withdrawListProps> => {
  const res = await axiosPrivate.get(`/withdraw/admin/all`)

  if (!res) {
    throw new Error('fail to get list withdrawal')
  }

  const data = await res.data
  return data
}