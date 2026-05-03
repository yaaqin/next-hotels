import {  axiosPublic } from "@/src/libs/instance"
import { menuRestoPublicProps } from "@/src/models/public/menuResto/list"

export const menuRestoPublicList = async (): Promise<menuRestoPublicProps> => {
  const res = await axiosPublic.get(`/resto-data-public/product`)

  if (!res) {
    throw new Error('fail to get list menu resto')
  }

  const data = await res.data
  return data
}