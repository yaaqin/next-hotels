import { cache } from 'react'
import { cookies } from 'next/headers'
import {
  ApiResponse,
  PublicSiteWithRooms,
  ResolvedPath,
  SearchListingPayload,
  SearchListingResult,
} from '@/src/models/public/roomListing'
import { publicRoomDetailState } from '@/src/models/public/room/detail'
import { DEFAULT_LANG, LANGUAGE_COOKIE, toSupportedLang } from '@/src/utils/languageCookie'
import { CURRENCY_COOKIE, resolveCurrency } from '@/src/utils/currencyCookie'
import { API_BASE_URL } from '@/src/libs/apiUrl'

// Dipanggil di server saat SSR — Googlebot cuma melihat HTML hasil render,
// kombinasi filter dikirim lewat body POST dan tidak pernah jadi URL API.


class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

// Bahasa dari cookie pilihan user; tanpa cookie (mis. Googlebot) → Indonesia
export async function getRequestLang() {
  const cookieStore = await cookies()
  return toSupportedLang(cookieStore.get(LANGUAGE_COOKIE)?.value)
}

// Mata uang tampilan dari cookie; tanpa cookie ikut bahasa (Googlebot → IDR)
export async function getRequestCurrency() {
  const cookieStore = await cookies()
  return resolveCurrency(cookieStore.get(CURRENCY_COOKIE)?.value, cookieStore.get(LANGUAGE_COOKIE)?.value)
}

// x-lang & x-currency ikut jadi bagian cache key fetch, jadi cache tiap bahasa/mata uang terpisah
async function request<T>(
  path: string,
  lang: string,
  init: RequestInit & { next?: { revalidate: number } },
  currency?: string,
) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-lang': lang,
      ...(currency && { 'x-currency': currency }),
      ...init.headers,
    },
  })
  if (!res.ok) {
    throw new ApiError(res.status, `[${res.status}] ${path}`)
  }
  const body = (await res.json()) as ApiResponse<T>
  return body.data
}

// Argumen string (bukan array) supaya cache() bisa dedupe generateMetadata & page
const resolveByKey = cache(async (path: string, lang: string) => {
  try {
    return await request<ResolvedPath>(
      `/public/room-listing/resolve?path=${encodeURIComponent(path)}`,
      lang,
      { next: { revalidate: 300 } },
    )
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
})

// null = path tidak dikenal (404 dari BE)
export const resolveRoomListing = (segments: string[], lang: string = DEFAULT_LANG) =>
  resolveByKey(segments.join('/'), lang)

const searchByKey = cache(async (body: string, lang: string, currency: string) =>
  request<SearchListingResult>(
    '/public/room-listing/search',
    lang,
    { method: 'POST', body, cache: 'no-store' },
    currency,
  ),
)

export const searchRoomListing = (
  payload: SearchListingPayload,
  lang: string = DEFAULT_LANG,
  currency: string = 'IDR',
) => searchByKey(JSON.stringify(payload), lang, currency)

// Detail kamar untuk RDP — ketersediaan & harga ikut tanggal, jadi tidak di-cache.
// null = kamar tidak ditemukan (404 dari BE)
const roomDetailByKey = cache(
  async (id: string, checkin: string, checkout: string, lang: string, currency: string) => {
    try {
      const qs = new URLSearchParams({ checkin, checkout }).toString()
      return await request<publicRoomDetailState>(
        `/public/rooms/${encodeURIComponent(id)}?${qs}`,
        lang,
        { cache: 'no-store' },
        currency,
      )
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null
      throw err
    }
  },
)

export const getPublicRoomDetail = (
  id: string,
  stay: { checkin: string; checkout: string },
  lang: string = DEFAULT_LANG,
  currency: string = 'IDR',
) => roomDetailByKey(id, stay.checkin, stay.checkout, lang, currency)

export const getPublicSites = cache(async () =>
  request<PublicSiteWithRooms[]>('/public/sites', DEFAULT_LANG, { next: { revalidate: 300 } }),
)
