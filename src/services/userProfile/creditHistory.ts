import { axiosUser } from "@/src/libs/instance"
import { userCreditHistoryProps } from "@/src/models/public/userProfile/creditHistory"

export const userCreditHistory = async (): Promise<userCreditHistoryProps> => {
  const res = await axiosUser.get(`/user/credit/history`)

  if (!res) {
    throw new Error('fail to get user credit history')
  }

  const data = await res.data
  return data
}

