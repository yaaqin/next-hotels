import { axiosUser } from "@/src/libs/instance"
import { userRecentActivityListProps } from "@/src/models/userRecentActivity/list"

export const recentActivityList = async (): Promise<userRecentActivityListProps> => {
  const res = await axiosUser.get(`/user/recent-activity`)

  if (!res) {
    throw new Error('fail to get list recent activity')
  }

  const data = await res.data
  return data
}

