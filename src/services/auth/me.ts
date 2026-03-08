import { axiosPrivate } from "@/src/libs/instance"
import { meProps } from "@/src/models/auth/me"

export const getMe = async (): Promise<meProps> => {
  const res = await axiosPrivate.get(`/auth/me`)

  if (!res) {
    throw new Error('fail to get my detail')
  }

  const data = await res.data
  return data
}