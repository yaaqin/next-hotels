import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  ArticleListParams,
  createArticle,
  getArticle,
  getArticles,
  publishArticle,
  restoreArticle,
  scheduleArticle,
  takedownArticle,
  unscheduleArticle,
  updateArticle,
  uploadArticleImage,
} from '@/src/services/article'
import { CreateArticlePayload, UpdateArticlePayload } from '@/src/models/article'

export const articleKeys = {
  all: ['articles'] as const,
  list: (params: ArticleListParams) => ['articles', 'list', params] as const,
  detail: (id: string) => ['articles', 'detail', id] as const,
}

export const useArticles = (params: ArticleListParams) =>
  useQuery({ queryKey: articleKeys.list(params), queryFn: () => getArticles(params) })

export const useArticle = (id?: string) =>
  useQuery({ queryKey: articleKeys.detail(id ?? ''), queryFn: () => getArticle(id!), enabled: !!id })

// Error sudah di-toast interceptor axiosPrivate
const useArticleMutation = <V,>(fn: (vars: V) => Promise<unknown>, success: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success(success)
      qc.invalidateQueries({ queryKey: articleKeys.all })
    },
  })
}

export const useCreateArticle = () =>
  useArticleMutation((p: CreateArticlePayload) => createArticle(p), 'Artikel dibuat')

export const useUpdateArticle = (id: string) =>
  useArticleMutation((p: UpdateArticlePayload) => updateArticle(id, p), 'Perubahan disimpan')

export const usePublishArticle = (id: string) =>
  useArticleMutation(() => publishArticle(id), 'Artikel tayang')

export const useScheduleArticle = (id: string) =>
  useArticleMutation((publishAt: string) => scheduleArticle(id, publishAt), 'Artikel dijadwalkan')

export const useUnscheduleArticle = (id: string) =>
  useArticleMutation(() => unscheduleArticle(id), 'Jadwal dibatalkan')

export const useTakedownArticle = (id: string) =>
  useArticleMutation((reason?: string) => takedownArticle(id, reason), 'Artikel di-takedown')

export const useRestoreArticle = (id: string) =>
  useArticleMutation(() => restoreArticle(id), 'Artikel dipulihkan jadi draft')

export const useUploadArticleImage = () => useMutation({ mutationFn: uploadArticleImage })
