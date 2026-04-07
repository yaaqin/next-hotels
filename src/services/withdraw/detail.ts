import { axiosPrivate } from "@/src/libs/instance"
import { detailWdProps } from "@/src/models/withdraw/detail"

export const WithdrawDetail = async (id: string): Promise<detailWdProps> => {
  const res = await axiosPrivate.get(`/withdraw/${id}`)

  if (!res) {
    throw new Error('fail to get detail withdrawal')
  }

  const data = await res.data
  return data
}