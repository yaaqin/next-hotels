import { addDays, format } from 'date-fns'

// Masa kontrak default saat bikin proposal (sama dengan DEFAULT_CONTRACT_DAYS di BE)
export const DEFAULT_CONTRACT_DAYS = 30

export const PROPOSAL_STATUS_COLOR: Record<string, string> = {
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-red-100 text-red-700',
  TERMINATED: 'bg-gray-200 text-gray-700',
}

// Form menyimpan tanggal sebagai "yyyy-MM-dd"; DatePicker pakai Date (zona lokal)
export const toDate = (value: string) => {
  if (!value) return undefined
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const toDateString = (date: Date | undefined) => (date ? format(date, 'yyyy-MM-dd') : '')
export const plusContractDays = (value: string) =>
  value ? toDateString(addDays(toDate(value)!, DEFAULT_CONTRACT_DAYS)) : ''

// Tanggal kontrak dihitung dari jam 00:00 WIB
export const toWibIso = (value: string) => `${value}T00:00:00+07:00`

export const formatContractDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
