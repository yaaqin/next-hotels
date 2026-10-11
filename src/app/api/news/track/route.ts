import { NextRequest } from 'next/server'
import { API_BASE_URL } from '@/src/libs/apiUrl'

// Klik kartu artikel terkait di /news/[slug] → diteruskan ke BE (dasar "Mungkin kamu juga suka").
// Lewat sini supaya sendBeacon dari browser tetap same-origin (BE beda origin, beacon JSON tidak bisa CORS).
export async function POST(req: NextRequest) {
  try {
    const { from, to } = (await req.json()) as { from?: unknown; to?: unknown }
    if (typeof from === 'string' && typeof to === 'string' && from !== to) {
      await fetch(`${API_BASE_URL}/public/news/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to }),
        cache: 'no-store',
      })
    }
  } catch (error) {
    console.error('[api/news/track] error =>', error)
  }
  return new Response(null, { status: 204 })
}
