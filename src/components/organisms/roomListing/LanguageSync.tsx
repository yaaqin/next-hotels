'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/src/stores/languageStore'
import { setLanguageCookie, toSupportedLang } from '@/src/utils/languageCookie'

// Padanan invalidateQueries() untuk halaman SSR: kalau bahasa di client beda dengan
// bahasa yang dipakai server saat render, simpan ke cookie lalu render ulang di server.
// Menangani dua kasus: user ganti bahasa di halaman ini, dan user lama yang bahasanya
// cuma ada di localStorage (belum ada cookie).
export default function LanguageSync({ serverLang }: { serverLang: string }) {
  // Dinormalisasi dengan aturan yang sama seperti server, supaya nilai localStorage
  // yang tidak dikenal tidak membuat client & server selamanya dianggap beda
  const language = toSupportedLang(useLanguageStore((s) => s.language))
  const router = useRouter()
  // Satu kali refresh per bahasa — pengaman terhadap loop kalau cookie gagal tersimpan
  const refreshedFor = useRef<string | null>(null)

  useEffect(() => {
    if (language === serverLang || refreshedFor.current === language) return
    refreshedFor.current = language
    setLanguageCookie(language)
    router.refresh()
  }, [language, serverLang, router])

  return null
}
