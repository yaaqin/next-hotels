import { axiosPrivate } from "@/src/libs/instance"
import { userLogsProps } from "@/src/models/userLogs/list"

export const userLogs = async (): Promise<userLogsProps> => {
  const res = await axiosPrivate.get(`/admin/user-logs/search`)

  if (!res) {
    throw new Error('fail to get user log list')
  }

  const data = await res.data
  return data
}