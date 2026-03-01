"use client"

import { Globe02Icon } from "hugeicons-react"
import { useState } from "react"

const languages = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
  { code: "jp", label: "日本語" },
  { code: "cn", label: "中文" },
]

export default function TopLanguageNavbar() {
  const [selected, setSelected] = useState(languages[0])
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full bg-black text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-end items-center relative">
        
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Globe02Icon size={16} />
          <span>{selected.label}</span>
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
                key={lang.code}
                onClick={() => {
                  setSelected(lang)
                  setOpen(false)
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
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