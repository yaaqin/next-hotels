import { axiosPrivate } from "@/src/libs/instance"
import { siteSeoPayload } from "@/src/models/sites/list"

export const updateSiteSeo = async ({ siteCode, ...payload }: siteSeoPayload & { siteCode: string }) => {
  const res = await axiosPrivate.patch(`/sites/${siteCode}/seo`, payload)
  return res.data
}
