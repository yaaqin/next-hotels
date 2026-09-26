import { create } from 'zustand'
import i18n from '../i18n'
import { readLanguageCookie, setLanguageCookie } from '../utils/languageCookie'

type Lang = 'idn' | 'eng' | 'jpn' | 'chn'
const STORAGE_KEY = 'language'

interface LanguageStore {
  language: Lang
  setLanguage: (lang: Lang) => void
}

// Sama dengan i18n: mulai dari cookie supaya konsisten dengan render server
const getSavedLang = (): Lang => readLanguageCookie() ?? 'idn'

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: getSavedLang(),
  setLanguage: (lang) => {
    localStorage.setItem(STORAGE_KEY, lang)
    // Cookie supaya halaman SSR (/hotel) juga tahu bahasa pilihan user
    setLanguageCookie(lang)
    i18n.changeLanguage(lang)
    set({ language: lang })
  },
}))