import { create } from 'zustand'
import i18n from '../i18n'

type Lang = 'idn' | 'eng' | 'jpn' | 'chn'
const STORAGE_KEY = 'language'

interface LanguageStore {
  language: Lang
  setLanguage: (lang: Lang) => void
}

const getSavedLang = (): Lang => {
  if (typeof window === 'undefined') return 'idn'
  return (localStorage.getItem(STORAGE_KEY) as Lang) || 'idn'
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getSavedLang(),
  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEY, lang)
    i18n.changeLanguage(lang)
    set({ language: lang })
  },
}))