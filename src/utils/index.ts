import { isBrowser } from "framer-motion"

export const getLanguage = (): string => {
  if (!isBrowser) return 'idn'
  return localStorage.getItem('language') ?? 'idn'
}

export const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '-'

  // Ambil bagian date dan time dari ISO
  const [datePart, timePart] = isoString.split('T')
  const [year, month, day] = datePart.split('-')
  const time = timePart?.slice(0, 5) // ambil HH:mm

  return `${day}-${month}-${year} - ${time}`
}