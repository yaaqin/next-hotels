"use client"

import { useLanguageStore } from "@/src/stores/languageStore"
import { Globe02Icon } from "hugeicons-react"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

type Lang = 'idn' | 'eng' | 'jpn' | 'chn'

const languages: { value: Lang; label: string }[] = [
  { value: "idn", label: "Bahasa Indonesia" },
  { value: "eng", label: "English" },
  { value: "jpn", label: "日本語" },
  { value: "chn", label: "中文" },
]

export default function TopLanguageNavbar() {
  const [open, setOpen] = useState(false)
  const { language: selected, setLanguage } = useLanguageStore()
  const queryClient = useQueryClient()

  const handleChangeLanguage = (lang: Lang) => {
    setLanguage(lang)
    setOpen(false)
    queryClient.invalidateQueries()
  }

  const selectedLabel = languages.find((l) => l.value === selected)?.label ?? selected

  return (
    <div className="w-full bg-black text-white text-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center relative">

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Globe02Icon size={16} />
          <span>{selectedLabel}</span>
          <svg
            className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
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