import { axiosPrivate } from "@/src/libs/instance"
import { sitelistProps } from "@/src/models/sites/list"

export const siteList = async (): Promise<sitelistProps> => {
  const res = await axiosPrivate.get(`/sites`)

  if (!res) {
    throw new Error('fail to get list sites')
  }

  const data = await res.data
  return data
}