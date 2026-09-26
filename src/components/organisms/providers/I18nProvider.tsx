'use client'

import { useEffect, useMemo, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/src/i18n'
import { readLanguageCookie, setLanguageCookie, toSupportedLang } from '@/src/utils/languageCookie'

const LANGUAGE_MIGRATED_KEY = 'language-cookie-migrated'

export default function I18nProvider({
  children,
  lang,
}: {
  children: ReactNode
  // Bahasa dari cookie, dibaca root layout di server
  lang: string
}) {
  // Server: instance per request supaya request lain (bahasa lain) tidak saling timpa.
  // Browser: instance global — sudah diinisialisasi dari cookie yang sama.
  const instance = useMemo(
    () => (typeof window === 'undefined' ? i18n.cloneInstance({ lng: lang }) : i18n),
    [lang],
  )

  useEffect(() => {
    if (readLanguageCookie()) return
    // User lama: bahasa cuma ada di localStorage → pindahkan ke cookie sekali
    const stored = localStorage.getItem('language')
    const target = toSupportedLang(stored ?? lang)
    setLanguageCookie(target)

    // Ganti bahasa di tengah hidrasi bikin mismatch (bagian di dalam Suspense dihidrasi
    // belakangan) → muat ulang sekali supaya server & browser langsung pakai bahasa itu.
    // Penanda sessionStorage mencegah reload berulang kalau cookie gagal tersimpan.
    if (target !== toSupportedLang(lang) && !sessionStorage.getItem(LANGUAGE_MIGRATED_KEY)) {
      sessionStorage.setItem(LANGUAGE_MIGRATED_KEY, '1')
      window.location.reload()
    }
  }, [lang])

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>
}
