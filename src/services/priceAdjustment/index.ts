import { axiosPrivate } from "@/src/libs/instance"
import {
  priceAdjustmentDetailProps,
  priceAdjustmentListProps,
  priceAdjustmentOptionsProps,
  priceAdjustmentPayload,
  priceCalendarProps,
  priceCalendarQuery,
} from "@/src/models/priceAdjustment"

export const priceAdjustmentList = async (status?: string): Promise<priceAdjustmentListProps> => {
  const res = await axiosPrivate.get(`/price-adjustments`, { params: { status } })
  return res.data
}

export const priceAdjustmentDetail = async (id: string): Promise<priceAdjustmentDetailProps> => {
  const res = await axiosPrivate.get(`/price-adjustments/${id}`)
  return res.data
}

export const priceAdjustmentOptions = async (siteCode?: string): Promise<priceAdjustmentOptionsProps> => {
  const res = await axiosPrivate.get(`/price-adjustments/options`, { params: { site_code: siteCode } })
  return res.data
}

export const priceAdjustmentCalendar = async (query: priceCalendarQuery): Promise<priceCalendarProps> => {
  const res = await axiosPrivate.get(`/price-adjustments/calendar`, {
    params: {
      site_code: query.siteCode,
      start: query.start,
      end: query.end,
      room_type_id: query.roomTypeId,
      adjustment_id: query.adjustmentId,
    },
  })
  return res.data
}

export const createPriceAdjustment = async (payload: priceAdjustmentPayload) => {
  const res = await axiosPrivate.post(`/price-adjustments`, payload)
  return res.data
}

export const approvePriceAdjustment = async ({ id, note }: { id: string; note?: string }) => {
  const res = await axiosPrivate.patch(`/price-adjustments/${id}/approve`, { note })
  return res.data
}

export const rejectPriceAdjustment = async ({ id, note }: { id: string; note?: string }) => {
  const res = await axiosPrivate.patch(`/price-adjustments/${id}/reject`, { note })
  return res.data
}
