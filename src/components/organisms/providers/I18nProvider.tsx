'use client'

import { useEffect, type ReactNode } from 'react'
import i18n from '@/src/i18n'

export default function I18nProvider({
  children,
}: {
  children: ReactNode
}) {
  useEffect(() => {
    const lang = localStorage.getItem('language') || 'idn'
    i18n.changeLanguage(lang)
  }, [])

  return <>{children}</>
}