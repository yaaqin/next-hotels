'use client'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { articlePath } from './helpers'

// Satu pasangan dari → ke cukup dihitung sekali per sesi browser (refresh / klik ulang tidak menggelembungkan)
const track = (from: string, to: string) => {
  try {
    const key = `news-click:${from}>${to}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch {
    // storage diblokir → tetap kirim
  }
  const body = new Blob([JSON.stringify({ from, to })], { type: 'application/json' })
  if (!navigator.sendBeacon?.('/api/news/track', body)) {
    fetch('/api/news/track', { method: 'POST', body, keepalive: true }).catch(() => {})
  }
}

// Link ke artikel lain dari halaman artikel `from` — klik dicatat untuk rekomendasi pembaca lain
export default function TrackedNewsLink({
  from,
  to,
  ...props
}: { from: string; to: string } & Omit<ComponentProps<typeof Link>, 'href'>) {
  return <Link {...props} href={articlePath(to)} onClick={() => track(from, to)} />
}
