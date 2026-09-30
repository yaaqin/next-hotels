import { axiosUser } from "@/src/libs/instance"
import {
  rescheduleConfirmPayload,
  rescheduleConfirmProps,
  reschedulePreviewPayload,
  reschedulePreviewProps,
} from "@/src/models/reschedule/preview"

export const previewReschedule = async (payload: reschedulePreviewPayload): Promise<reschedulePreviewProps> => {
  const res = await axiosUser.post(`/booking/reschedule/preview`, payload)
  return res.data
}

export const confirmReschedule = async ({ bookingId, ...body }: rescheduleConfirmPayload): Promise<rescheduleConfirmProps> => {
  const res = await axiosUser.patch(`/booking/${bookingId}/reschedule`, body)
  return res.data
}
