"use client"

import { useLanguageStore } from "@/src/stores/languageStore"
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { useCurrency } from "@/src/components/organisms/providers/CurrencyProvider"
import { CURRENCY_OPTIONS } from "@/src/constans/currency"
import type { SupportedCurrency } from "@/src/utils/currencyCookie"
import { Globe02Icon, CoinsSwapIcon } from "hugeicons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

type Lang = 'idn' | 'eng' | 'jpn' | 'chn'

const languages: { value: Lang; label: string }[] = [
  { value: "idn", label: "Bahasa Indonesia" },
  { value: "eng", label: "English" },
  { value: "jpn", label: "日本語" },
  { value: "chn", label: "中文" },
]

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function TopLanguageNavbar() {
  const [open, setOpen] = useState<'language' | 'currency' | null>(null)
  const { setLanguage } = useLanguageStore()
  const selected = useCurrentLanguage()
  const { currency, setCurrency } = useCurrency()
  const queryClient = useQueryClient()

  const handleChangeLanguage = (lang: Lang) => {
    setLanguage(lang)
    setOpen(null)
    queryClient.invalidateQueries()
  }

  // Sama seperti ganti bahasa: data harga di-fetch ulang dengan x-currency baru
  const handleChangeCurrency = (next: SupportedCurrency) => {
    setCurrency(next)
    setOpen(null)
    queryClient.invalidateQueries()
  }

  const selectedLabel = languages.find((l) => l.value === selected)?.label ?? selected

  return (
    <div className="w-full bg-black text-white text-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center gap-6 relative">

        <button
          onClick={() => setOpen(open === 'currency' ? null : 'currency')}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <CoinsSwapIcon size={16} />
          <span>{currency}</span>
          <Chevron open={open === 'currency'} />
        </button>

        <button
          onClick={() => setOpen(open === 'language' ? null : 'language')}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Globe02Icon size={16} />
          <span>{selectedLabel}</span>
          <Chevron open={open === 'language'} />
        </button>

        {open === 'currency' && (
          <div className="absolute right-40 top-10 bg-white text-black rounded-md shadow-lg w-44 py-2 z-50">
            {CURRENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChangeCurrency(opt.value)}
                className={`w-full flex justify-between text-left px-4 py-2 hover:bg-gray-100 transition ${
                  currency === opt.value ? "font-semibold bg-gray-50" : ""
                }`}
              >
                <span>{opt.value}</span>
                <span className="text-gray-400">{opt.symbol}</span>
              </button>
            ))}
          </div>
        )}

        {open === 'language' && (
          <div className="absolute right-4 top-10 bg-white text-black rounded-md shadow-lg w-44 py-2 z-50">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleChangeLanguage(lang.value)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${
                  selected === lang.value ? "font-semibold bg-gray-50" : ""
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
