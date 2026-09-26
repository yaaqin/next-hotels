import { cache } from 'react'
import {
  ApiResponse,
  PublicSiteWithRooms,
  ResolvedPath,
  SearchListingPayload,
  SearchListingResult,
} from '@/src/models/public/roomListing'

// Dipanggil di server saat SSR — Googlebot cuma melihat HTML hasil render,
// kombinasi filter dikirim lewat body POST dan tidak pernah jadi URL API.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://mbsc-be.yaaqin.xyz'
// Konten RLP & SEO: bahasa Indonesia dulu
const LANG = 'idn'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string, init: RequestInit & { next?: { revalidate: number } }) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', 'x-lang': LANG, ...init.headers },
  })
  if (!res.ok) {
    throw new ApiError(res.status, `[${res.status}] ${path}`)
  }
  const body = (await res.json()) as ApiResponse<T>
  return body.data
}

// null = path tidak dikenal (404 dari BE)
export const resolveRoomListing = cache(async (segments: string[]) => {
  const path = segments.map(encodeURIComponent).join('/')
  try {
    return await request<ResolvedPath>(`/public/room-listing/resolve?path=${path}`, {
      next: { revalidate: 300 },
    })
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
})

// Payload di-serialize supaya cache() bisa dedupe panggilan generateMetadata & page
const searchByKey = cache(async (key: string) =>
  request<SearchListingResult>('/public/room-listing/search', {
    method: 'POST',
    body: key,
    cache: 'no-store',
  }),
)

export const searchRoomListing = (payload: SearchListingPayload) =>
  searchByKey(JSON.stringify(payload))

export const getPublicSites = cache(async () =>
  request<PublicSiteWithRooms[]>('/public/sites', { next: { revalidate: 300 } }),
)
