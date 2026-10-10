'use client'

import React, { useEffect, useRef } from "react";
import Images from "../../atoms/images";
import { MoonIcon, Sun01Icon } from "hugeicons-react";
import { queryClient } from "@/src/libs/react-query";
import { useLanguageStore } from "@/src/stores/languageStore";
import { useCurrentLanguage } from '@/src/hooks/useCurrentLanguage'
import { useThemeMode } from '@/src/hooks/useThemeMode'

const LANG_OPTIONS = [
  { label: "Bahasa Indonesia", value: "idn" },
  { label: "English", value: "eng" },
  { label: "日本語", value: "jpn" },
  { label: "中文", value: "chn" },
];

type Lang = "idn" | "eng" | "jpn" | "chn";

const ProfileCardnavbar: React.FC<{
  name: string;
  email: string;
  avatarUrl: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Layar kecil: tampil foto saja, nama & email pindah ke dropdown
  compact?: boolean;
}> = ({ name, email, avatarUrl, open, onOpenChange, compact = false }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useThemeMode();

  const { setLanguage } = useLanguageStore();
  const language = useCurrentLanguage();

  // 🔹 klik di luar kartu → tutup dropdown
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onOpenChange]);

  // 🔹 listen language-change event → invalidate queries
  useEffect(() => {
    const handler = () => queryClient.invalidateQueries();
    window.addEventListener("language-change", handler);
    return () => window.removeEventListener("language-change", handler);
  }, []);

  // 🔹 change language
  const changeLanguage = (value: string) => {
    setLanguage(value as Lang); // handles localStorage + i18n + zustand
    window.dispatchEvent(
      new CustomEvent("language-change", {
        detail: { language: value },
      })
    );
  };

  return (
    <div ref={rootRef} className="relative shrink-0">
      {/* Card — seluruh kartu bisa diklik */}
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-label="Menu profil"
        className={`flex items-center rounded-xl bg-blue-400 transition hover:bg-blue-500 cursor-pointer ${compact ? "p-1" : "gap-3 px-3 py-2"}`}
      >
        <Images
          src={avatarUrl}
          alt={name}
          width={30}
          height={30}
          className={`rounded-full object-cover ${compact ? "h-8 w-8" : "h-10 w-10"}`}
        />

        {!compact && (
          <>
            <div className="leading-tight text-left">
              <p className="text-xs font-semibold text-white">{name}</p>
              <p className="text-xs text-white">{email}</p>
            </div>
            <span className="ml-1 text-white">⋮</span>
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg z-50">
          {compact && (
            <>
              <div className="px-4 py-3 leading-tight">
                <p className="text-sm font-semibold text-gray-800">{name}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
              <div className="h-px bg-gray-200" />
            </>
          )}
          {/* Language */}
          <div className="px-4 py-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              Language
            </p>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full rounded-md border px-2 py-1 text-sm focus:outline-none"
            >
              {LANG_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Theme */}
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-sm text-gray-700">Theme</p>
            <button
              onClick={toggleTheme}
              className="p-2 text-lg rounded-xl border border-zinc-300 dark:border-zinc-700"
            >
              {isDark ? <MoonIcon /> : <Sun01Icon />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCardnavbar;