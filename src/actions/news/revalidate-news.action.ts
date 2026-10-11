'use server'

import { cookies } from 'next/headers'
import { updateTag } from 'next/cache'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { canAccessNewsroom } from '@/src/constans/newsroom'
import { NEWS_CACHE_TAG } from '@/src/services/news'

// Dipanggil newsroom setelah artikel disimpan / tayang / dijadwalkan / takedown / restore,
// supaya /news, /news/[slug] dan sitemap langsung pakai data baru (bukan menunggu revalidate 60 detik).
// Role dicek ke BE dulu — server action bisa dipanggil siapa saja.
export const revalidateNewsAction = async (): Promise<void> => {
  const token = (await cookies()).get('access_token')?.value
  if (!token) return

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return
    const me = (await res.json()) as { data?: { role?: { name?: string } } }
    if (!canAccessNewsroom(me.data?.role?.name)) return
  } catch (error) {
    console.error('[revalidateNewsAction] error =>', error)
    return
  }

  updateTag(NEWS_CACHE_TAG)
}
