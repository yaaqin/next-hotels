import { axiosPrivate } from "@/src/libs/instance"
import { BranchRestoListProps } from "@/src/models/restaurant/restoDashboard/branch/list"

export const restoBranchList = async (): Promise<BranchRestoListProps> => {
  const res = await axiosPrivate.get(`/resto-data/sites`)

  if (!res) {
    throw new Error('fail to get list resto')
  }

  const data = await res.data
  return data
}