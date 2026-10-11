import { axiosPrivate } from '@/src/libs/instance'
import { ApiResponse } from '@/src/models/config'
import {
  ArticleDetail,
  ArticleList,
  ArticleStatus,
  CreateArticlePayload,
  UpdateArticlePayload,
} from '@/src/models/article'

// Endpoint /articles — dashboard newsroom (ARTICLE_ADMIN, DEV, SUPERADMIN)

export type ArticleListParams = { status?: ArticleStatus; search?: string; page?: number; pageSize?: number }

export const getArticles = async (params: ArticleListParams): Promise<ApiResponse<ArticleList>> =>
  (await axiosPrivate.get('/articles', { params })).data

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
