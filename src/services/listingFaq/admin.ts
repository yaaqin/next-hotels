import { axiosPrivate } from "@/src/libs/instance"
import { listingFaqListProps, listingFaqPayload } from "@/src/models/listingFaq"

export const listingFaqList = async (): Promise<listingFaqListProps> => {
  const res = await axiosPrivate.get(`/listing-faqs`)
  return res.data
}

export const createListingFaq = async (payload: listingFaqPayload) => {
  const res = await axiosPrivate.post(`/listing-faqs`, payload)
  return res.data
}

export const updateListingFaq = async ({ id, ...payload }: Partial<listingFaqPayload> & { id: string }) => {
  const res = await axiosPrivate.patch(`/listing-faqs/${id}`, payload)
  return res.data
}

export const deleteListingFaq = async (id: string) => {
  const res = await axiosPrivate.delete(`/listing-faqs/${id}`)
  return res.data
}

export const setAutoFaq = async ({ key, isHidden }: { key: string; isHidden: boolean }) => {
  const res = await axiosPrivate.put(`/listing-faqs/auto/${key}`, { isHidden })
  return res.data
}

export const reorderListingFaq = async (items: { kind: 'auto' | 'custom'; id: string }[]): Promise<listingFaqListProps> => {
  const res = await axiosPrivate.put(`/listing-faqs/order`, { items })
  return res.data
}
