import { axiosUser } from "@/src/libs/instance"
import { userProfileProps } from "@/src/models/public/userProfile"

export const userProfile = async (): Promise<userProfileProps> => {
  const res = await axiosUser.get(`/user/profile`)

  if (!res) {
    throw new Error('fail to get user Profile')
  }

  const data = await res.data
  return data
}

