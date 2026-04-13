import { axiosPrivate } from "@/src/libs/instance"

export const downloadBookingReport = async (
  startDate: string,
  endDate: string,
  siteCode?: string,
) => {
  const res = await axiosPrivate.get('/finance/report/booking', {
    params: { startDate, endDate, ...(siteCode && { siteCode }) },
    responseType: 'blob',
  })

  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = `booking-report_${startDate}_${endDate}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}