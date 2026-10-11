import { cache } from 'react'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { ApiResponse } from '@/src/models/config'
import {
  PublicArticleList,
  PublicArticleRelated,
  PublicArticleResolved,
  PublicArticleSitemapItem,
} from '@/src/models/article'

// Dipanggil di server saat SSR /news. Revalidate pendek supaya publish / takedown cepat terlihat;
// aksi di newsroom juga langsung meng-expire tag ini (src/actions/news).
const REVALIDATE = 60
export const NEWS_CACHE_TAG = 'news'

class NewsApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: REVALIDATE, tags: [NEWS_CACHE_TAG] } })
  if (!res.ok) throw new NewsApiError(res.status, `[${res.status}] ${path}`)
  return ((await res.json()) as ApiResponse<T>).data
}

export const getNewsList = cache((page: number, tag?: string) => {
  const qs = new URLSearchParams({ page: String(page), pageSize: '12' })
  if (tag) qs.set('tag', tag)
  return request<PublicArticleList>(`/public/news?${qs}`)
})

// null = slug tidak dikenal / artikel tidak tayang (BE membalas 200 { redirect: null, article: null })
export const getNewsArticle = cache(async (slug: string): Promise<PublicArticleResolved | null> => {
  try {
    const res = await request<PublicArticleResolved | { redirect: null; article: null }>(
      `/public/news/${encodeURIComponent(slug)}`,
    )
    return res.article || res.redirect ? (res as PublicArticleResolved) : null
  } catch (err) {
    if (err instanceof NewsApiError && err.status === 404) return null
    throw err
  }
})

const EMPTY_RELATED: PublicArticleRelated = { latest: [], similar: [], alsoLiked: [], others: [] }

// Gagal ambil artikel terkait tidak boleh menggagalkan halaman artikel
export const getNewsRelated = cache(async (slug: string) => {
  try {
    return await request<PublicArticleRelated>(`/public/news/${encodeURIComponent(slug)}/related`)
  } catch (err) {
    console.error('[news] gagal ambil artikel terkait:', err)
    return EMPTY_RELATED
  }
})

export const getNewsSitemap = () => request<PublicArticleSitemapItem[]>('/public/news/sitemap')
