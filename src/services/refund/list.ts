import { axiosPrivate } from "@/src/libs/instance"
import { refundListProps } from "@/src/models/refund/list"

export const refundList = async (): Promise<refundListProps> => {
  const res = await axiosPrivate.get(`/refund`)

  if (!res) {
    throw new Error('fail to get list refund')
  }

  const data = await res.data
  return data
}