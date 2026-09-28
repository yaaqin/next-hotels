import { NextRequest, NextResponse } from 'next/server'
import { defaultStayDates } from './app/(publicAccess)/(publicDashboard2)/hotel/hotel.helper'
import { API_BASE_URL } from './libs/apiUrl'

// Status code RLP harus diputuskan SEBELUM render: root layout membungkus halaman dengan
// <Suspense>, jadi redirect()/notFound() dari page baru terjadi setelah header 200 terkirim.
// Di sini alias/urutan lain → 308, segment tidak dikenal → 404 asli (bukan soft 404).

const CACHE_TTL_MS = 60_000

type Outcome =
  | { status: 'ok'; kind: 'listing' | 'room'; redirect: string | null }
  | { status: 'not-found' }
  | { status: 'error' }

const cache = new Map<string, { at: number; outcome: Outcome }>()

async function resolve(path: string): Promise<Outcome> {
  const hit = cache.get(path)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.outcome

  let outcome: Outcome
  try {
    const res = await fetch(
      `${API_BASE_URL}/public/room-listing/resolve?path=${encodeURIComponent(path)}`,
      { headers: { 'x-lang': 'idn' } },
    )
    if (res.status === 404) {
      outcome = { status: 'not-found' }
    } else if (!res.ok) {
      outcome = { status: 'error' }
    } else {
      const { data } = await res.json()
      outcome = { status: 'ok', kind: data.kind, redirect: data.redirect }
    }
  } catch {
    outcome = { status: 'error' }
  }

  // Error BE tidak di-cache supaya request berikutnya mencoba lagi
  if (outcome.status !== 'error') cache.set(path, { at: Date.now(), outcome })
  return outcome
}

export async function proxy(req: NextRequest) {
  let path: string
  try {
    path = decodeURIComponent(req.nextUrl.pathname.replace(/^\/hotel\/?/, ''))
  } catch {
    return NextResponse.rewrite(new URL('/hotel-not-found', req.url))
  }

  const outcome = await resolve(path)

  // BE bermasalah → biarkan page yang menangani (fallback redirect/notFound di page)
  if (outcome.status === 'error') return NextResponse.next()

  // Route yang tidak ada → Next merender not-found dengan status 404
  if (outcome.status === 'not-found') {
    return NextResponse.rewrite(new URL('/hotel-not-found', req.url))
  }

  if (outcome.redirect) {
    const url = req.nextUrl.clone()
    url.pathname = outcome.redirect
    return NextResponse.redirect(url, 308)
  }

  // Detail kamar butuh tanggal — isi default hari ini (redirect sementara, bukan 308)
  if (outcome.kind === 'room' && !req.nextUrl.searchParams.get('checkin')) {
    const url = req.nextUrl.clone()
    const { checkin, checkout } = defaultStayDates()
    url.searchParams.set('checkin', checkin)
    url.searchParams.set('checkout', checkout)
    return NextResponse.redirect(url, 307)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/hotel', '/hotel/:path*'],
}
