import { cache } from 'react'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { ApiResponse } from '@/src/models/config'
import {
  PublicArticleList,
  PublicArticleResolved,
  PublicArticleSitemapItem,
} from '@/src/models/article'

// Dipanggil di server saat SSR /news. Revalidate pendek supaya publish / takedown cepat terlihat.
const REVALIDATE = 60

class NewsApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function request<T>(path: string) {
  const res = await fetch(`${API_BASE_URL}${path}`, { next: { revalidate: REVALIDATE } })
  if (!res.ok) throw new NewsApiError(res.status, `[${res.status}] ${path}`)
  return ((await res.json()) as ApiResponse<T>).data
}

export const getNewsList = cache((page: number, tag?: string) => {
  const qs = new URLSearchParams({ page: String(page), pageSize: '12' })
  if (tag) qs.set('tag', tag)
  return request<PublicArticleList>(`/public/news?${qs}`)
})

// null = slug tidak dikenal / artikel tidak tayang (404 dari BE)
export const getNewsArticle = cache(async (slug: string) => {
  try {
    return await request<PublicArticleResolved>(`/public/news/${encodeURIComponent(slug)}`)
  } catch (err) {
    if (err instanceof NewsApiError && err.status === 404) return null
    throw err
  }
})

export const getNewsSitemap = () => request<PublicArticleSitemapItem[]>('/public/news/sitemap')
