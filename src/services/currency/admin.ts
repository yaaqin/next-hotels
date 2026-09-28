import { axiosPrivate } from "@/src/libs/instance"
import { currencyAdminListProps } from "@/src/models/currency/list"

export const currencyAdminList = async (): Promise<currencyAdminListProps> => {
  const res = await axiosPrivate.get(`/currencies`)
  return res.data
}

// Kunci kurs manual — cron harian tidak menimpa
export const setManualRate = async ({ code, idrPerUnit }: { code: string; idrPerUnit: number }) => {
  const res = await axiosPrivate.patch(`/currencies/${code}/rate`, { idrPerUnit })
  return res.data
}

export const resetRateToAuto = async (code: string) => {
  const res = await axiosPrivate.patch(`/currencies/${code}/rate/auto`)
  return res.data
}

export const refreshRates = async () => {
  const res = await axiosPrivate.post(`/currencies/refresh`)
  return res.data
}
