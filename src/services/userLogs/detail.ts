import { axiosPrivate } from "@/src/libs/instance"
import { detailUserLogProps } from "@/src/models/userLogs/detail"

export const userLogDetail = async (id: string): Promise<detailUserLogProps> => {
  const res = await axiosPrivate.get(`/admin/user-logs/${id}`)

  if (!res) {
    throw new Error('fail to get detail user log')
  }

  const data = await res.data
  return data
}