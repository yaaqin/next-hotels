import { axiosPrivate } from '@/src/libs/instance'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { getAccessTokenClient } from '@/src/utils/auth/token'
import { ApiResponse } from '@/src/models/config'
import {
  AnalyticsRange,
  ArticleAnalytics,
  ArticleDetail,
  ArticleList,
  ArticleStatus,
  ArticleTagSuggestion,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '@/src/models/article'

// Endpoint /articles — dashboard newsroom (ARTICLE_ADMIN, DEV, SUPERADMIN)

export type ArticleListParams = { status?: ArticleStatus; search?: string; page?: number; pageSize?: number }

export const getArticles = async (params: ArticleListParams): Promise<ApiResponse<ArticleList>> =>
  (await axiosPrivate.get('/articles', { params })).data

export const getArticleTags = async (): Promise<ApiResponse<ArticleTagSuggestion[]>> =>
  (await axiosPrivate.get('/articles/tags')).data

export const getArticleAnalytics = async (range: AnalyticsRange): Promise<ApiResponse<ArticleAnalytics>> =>
  (await axiosPrivate.get('/articles/analytics', { params: { range } })).data

export const getArticle = async (id: string): Promise<ApiResponse<ArticleDetail>> =>
  (await axiosPrivate.get(`/articles/${id}`)).data

export const createArticle = async (
  payload: CreateArticlePayload,
): Promise<ApiResponse<{ id: string }>> => (await axiosPrivate.post('/articles', payload)).data

export const updateArticle = async (id: string, payload: UpdateArticlePayload) =>
  (await axiosPrivate.patch(`/articles/${id}`, payload)).data

export const publishArticle = async (id: string) =>
  (await axiosPrivate.post(`/articles/${id}/publish`)).data

export const scheduleArticle = async (id: string, publishAt: string) =>
  (await axiosPrivate.post(`/articles/${id}/schedule`, { publishAt })).data

export const unscheduleArticle = async (id: string) =>
  (await axiosPrivate.post(`/articles/${id}/unschedule`)).data

export const takedownArticle = async (id: string, reason?: string) =>
  (await axiosPrivate.post(`/articles/${id}/takedown`, { reason })).data

export const restoreArticle = async (id: string) =>
  (await axiosPrivate.post(`/articles/${id}/restore`)).data

export const uploadArticleImage = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  const form = new FormData()
  form.append('file', file)
  return (
    await axiosPrivate.post('/articles/upload-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data
}

// ── Laporan news: download Excel (GET /report/news/export) ──

export const getNewsExportLimit = async (): Promise<ApiResponse<{ maxDays: number; today: string }>> =>
  (await axiosPrivate.get('/report/news/export-limit')).data

// fetch biasa (bukan axios) supaya pesan error BE (rentang terlalu panjang, tunggu jeda) bisa dibaca dari body
export const downloadNewsReport = async (from: string, to: string) => {
  const res = await fetch(`${API_BASE_URL}/report/news/export?from=${from}&to=${to}`, {
    headers: { Authorization: `Bearer ${getAccessTokenClient() ?? ''}` },
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null
    const msg = Array.isArray(body?.message) ? body.message.join(', ') : body?.message
    throw new Error(msg || `Gagal download (${res.status})`)
  }
  const url = URL.createObjectURL(await res.blob())
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-news_${from}_${to}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
