

import { axiosPrivate } from "@/src/libs/instance"
import { sessionTokenLIstProps } from "@/src/models/sessionToken/list"

export const sessionTokenList = async (page?: string): Promise<sessionTokenLIstProps> => {
  const res = await axiosPrivate.get(`/session-tokens${page && `?page=${page}`}`)

  if (!res) {
    throw new Error('fail to get list session token')
  }

  const data = await res.data
  return data
}