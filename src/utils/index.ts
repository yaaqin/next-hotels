import { isBrowser } from "framer-motion"

export const getLanguage = (): string => {
  if (!isBrowser) return 'idn'
  return localStorage.getItem('language') ?? 'idn'
}