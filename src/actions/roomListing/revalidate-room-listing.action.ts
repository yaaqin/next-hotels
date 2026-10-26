'use server'

import { cookies } from 'next/headers'
import { updateTag } from 'next/cache'
import { API_BASE_URL } from '@/src/libs/apiUrl'
import { ROOM_LISTING_CACHE_TAG } from '@/src/services/roomListing'

// Dipanggil dashboard setelah kamar / tipe kamar dibuat atau diubah,
// supaya RLP baru langsung masuk sitemap.xml (bukan menunggu revalidate).
// Token dicek ke BE dulu — server action bisa dipanggil siapa saja.
export const revalidateRoomListingAction = async (): Promise<void> => {
  const token = (await cookies()).get('access_token')?.value
  if (!token) return

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return
  } catch (error) {
    console.error('[revalidateRoomListingAction] error =>', error)
    return
  }

  updateTag(ROOM_LISTING_CACHE_TAG)
}
