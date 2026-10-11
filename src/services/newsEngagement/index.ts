import { axiosUser } from '@/src/libs/instance'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { ApiResponse } from '@/src/models/config'

// Dipanggil dari browser di /news/[slug]. Like butuh login Google (token user via axiosUser).

export type LikeState = { liked: boolean; likeCount: number }

const likePath = (slug: string) => `/news/${encodeURIComponent(slug)}/like`

export const getLikeStatus = async (slug: string): Promise<ApiResponse<LikeState>> =>
  (await axiosUser.get(likePath(slug))).data

export const setLike = async (slug: string, liked: boolean): Promise<ApiResponse<LikeState>> =>
  (await (liked ? axiosUser.put(likePath(slug)) : axiosUser.delete(likePath(slug)))).data

// Tanpa header/body → simple request (tidak perlu preflight CORS); gagal dibiarkan diam
export const recordView = async (slug: string): Promise<number | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/public/news/${encodeURIComponent(slug)}/view`, {
      method: 'POST',
      keepalive: true,
    })
    if (!res.ok) return null
    return ((await res.json()) as ApiResponse<{ viewCount: number }>).data.viewCount
  } catch {
    return null
  }
}
