import { setCookie } from 'cookies-next'

// Bahasa disimpan di localStorage (dibaca axios di client) DAN cookie (dibaca server saat SSR).
// Nama sama dengan key localStorage supaya gampang dilacak.
export const LANGUAGE_COOKIE = 'language'
export const SUPPORTED_LANGS = ['idn', 'eng', 'jpn', 'chn'] as const
export const DEFAULT_LANG = 'idn'

export type SupportedLang = (typeof SUPPORTED_LANGS)[number]

export function toSupportedLang(value: string | undefined | null): SupportedLang {
  return SUPPORTED_LANGS.includes(value as SupportedLang) ? (value as SupportedLang) : DEFAULT_LANG
}

export function setLanguageCookie(lang: string) {
  setCookie(LANGUAGE_COOKIE, toSupportedLang(lang), {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
