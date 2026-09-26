'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/src/stores/languageStore'
import { useCurrency } from '@/src/components/organisms/providers/CurrencyProvider'
import { setLanguageCookie, toSupportedLang } from '@/src/utils/languageCookie'

// Padanan invalidateQueries() untuk halaman SSR: kalau bahasa / mata uang di browser beda
// dengan yang dipakai server saat render, simpan ke cookie lalu render ulang di server.
export default function PreferenceSync({
  serverLang,
  serverCurrency,
}: {
  serverLang: string
  serverCurrency: string
}) {
  // Dinormalisasi dengan aturan yang sama seperti server, supaya nilai tidak dikenal
  // tidak membuat client & server selamanya dianggap beda
  const language = toSupportedLang(useLanguageStore((s) => s.language))
  const { currency } = useCurrency()
  const router = useRouter()
  // Satu kali refresh per kombinasi — pengaman terhadap loop kalau cookie gagal tersimpan
  const refreshedFor = useRef<string | null>(null)

  useEffect(() => {
    const key = `${language}|${currency}`
    if ((language === serverLang && currency === serverCurrency) || refreshedFor.current === key) return
    refreshedFor.current = key
    setLanguageCookie(language)
    router.refresh()
  }, [language, currency, serverLang, serverCurrency, router])

  return null
}
