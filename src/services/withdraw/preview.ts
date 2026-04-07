import { axiosUser } from "@/src/libs/instance"
import { detailUserProps } from "@/src/models/users/detail"

export const WithdrawPreview = async (amount: string): Promise<detailUserProps> => {
  const res = await axiosUser.get(`/withdraw/preview?amountIdr=${amount}`)

  if (!res) {
    throw new Error('fail to get detail users')
  }

  const data = await res.data
  return data
}