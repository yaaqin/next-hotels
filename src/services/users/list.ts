import { axiosPrivate } from "@/src/libs/instance"
import { userListProps } from "@/src/models/users/list"

export const userList = async (): Promise<userListProps> => {
  const res = await axiosPrivate.get(`/admins`)

  if (!res) {
    throw new Error('fail to get list users')
  }

  const data = await res.data
  return data
}