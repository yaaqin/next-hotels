import { getCookie, setCookie } from 'cookies-next'
import { readLanguageCookie, toSupportedLang, type SupportedLang } from './languageCookie'

// Mata uang TAMPILAN pilihan user. Yang ditagih tetap IDR (lihat CurrencyService di BE).
// Cookie hanya ada kalau user memilih sendiri; tanpa cookie mata uang ikut bahasa.
export const CURRENCY_COOKIE = 'currency'
export const SUPPORTED_CURRENCIES = ['IDR', 'USD', 'SGD', 'JPY', 'CNY'] as const
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number]

export const LANG_CURRENCY: Record<SupportedLang, SupportedCurrency> = {
  idn: 'IDR',
  eng: 'USD',
  jpn: 'JPY',
  chn: 'CNY',
}

// Locale angka & tanggal per bahasa aplikasi
export const LANG_LOCALE: Record<SupportedLang, string> = {
  idn: 'id-ID',
  eng: 'en-US',
  jpn: 'ja-JP',
  chn: 'zh-CN',
}

export function toSupportedCurrency(value: string | undefined | null): SupportedCurrency | null {
  const upper = (value ?? '').toUpperCase()
  return SUPPORTED_CURRENCIES.includes(upper as SupportedCurrency) ? (upper as SupportedCurrency) : null
}

// Dipakai server (cookie request) & browser — hasilnya harus sama supaya hidrasi cocok
export function resolveCurrency(cookieValue: string | undefined | null, lang: string | undefined | null) {
  return toSupportedCurrency(cookieValue) ?? LANG_CURRENCY[toSupportedLang(lang)]
}

export function readCurrencyCookie(): SupportedCurrency | null {
  if (typeof document === 'undefined') return null
  const value = getCookie(CURRENCY_COOKIE)
  return typeof value === 'string' ? toSupportedCurrency(value) : null
}

export function setCurrencyCookie(currency: SupportedCurrency) {
  setCookie(CURRENCY_COOKIE, currency, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}

// Header x-currency untuk axios di browser
export function getClientCurrency(): SupportedCurrency {
  return resolveCurrency(readCurrencyCookie(), readLanguageCookie())
}
