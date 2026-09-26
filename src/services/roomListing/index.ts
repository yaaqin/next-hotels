import { cache } from 'react'
import { cookies } from 'next/headers'
import {
  ApiResponse,
  PublicSiteWithRooms,
  ResolvedPath,
  SearchListingPayload,
  SearchListingResult,
} from '@/src/models/public/roomListing'
import { DEFAULT_LANG, LANGUAGE_COOKIE, toSupportedLang } from '@/src/utils/languageCookie'

// Dipanggil di server saat SSR — Googlebot cuma melihat HTML hasil render,
// kombinasi filter dikirim lewat body POST dan tidak pernah jadi URL API.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mbsc-be.yaaqin.xyz'

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

// x-lang ikut jadi bagian cache key fetch, jadi cache tiap bahasa terpisah
async function request<T>(path: string, lang: string, init: RequestInit & { next?: { revalidate: number } }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'x-lang': lang, ...init.headers },
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

const searchByKey = cache(async (body: string, lang: string) =>
  request<SearchListingResult>('/public/room-listing/search', lang, {
    method: 'POST',
    body,
    cache: 'no-store',
  }),
)

export const searchRoomListing = (payload: SearchListingPayload, lang: string = DEFAULT_LANG) =>
  searchByKey(JSON.stringify(payload), lang)

export const getPublicSites = cache(async () =>
  request<PublicSiteWithRooms[]>('/public/sites', DEFAULT_LANG, { next: { revalidate: 300 } }),
)
