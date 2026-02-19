'use client'
import { useEffect } from 'react'
import { useLanguageStore } from '@/src/stores/languageStore'

type Lang = 'idn' | 'eng' | 'jpn' | 'chn'
const VALID_LANGS: Lang[] = ['idn', 'eng', 'jpn', 'chn']

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguageStore()

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang
    if (saved && VALID_LANGS.includes(saved) && saved !== language) {
      setLanguage(saved)
    } else if (!saved) {
      localStorage.setItem('language', language)
    }
  }, [])

  return <>{children}</>
}