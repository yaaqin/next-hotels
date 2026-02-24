import { axiosPrivate } from "@/src/libs/instance"
import { detailUserProps } from "@/src/models/users/detail"

export const userDetail = async (id: string): Promise<detailUserProps> => {
  const res = await axiosPrivate.get(`/admins/${id}`)

  if (!res) {
    throw new Error('fail to get detail users')
  }

  const data = await res.data
  return data
}