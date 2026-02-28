import { isBrowser } from "framer-motion"

export const getLanguage = (): string => {
  if (!isBrowser) return 'idn'
  return localStorage.getItem('language') ?? 'idn'
}

export const getToday = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}