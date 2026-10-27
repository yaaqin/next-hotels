import type { MetadataRoute } from 'next'
import { unstable_rethrow } from 'next/navigation'
import { countRoomListing, getPublicSites, resolveRoomListing } from '@/src/services/roomListing'
import { effectiveCanonicalPath, MIN_INDEXABLE_ROOMS, SITE_URL } from './hotel.helper'

// /hotel/sitemap.xml — bagian RLP dari sitemap index (/sitemap.xml)
export const revalidate = 3600

// Halaman RLP yang masuk sitemap = yang indexable saja (cukup kamar, bukan alias/redirect)
async function isIndexable(path: string) {
  const segments = path.replace(/^\/hotel\/?/, '').split('/').filter(Boolean)
  const resolved = await resolveRoomListing(segments)
  if (!resolved || resolved.redirect || resolved.kind !== 'listing') return false
  // Halaman yang canonical-nya menunjuk ke halaman lain tidak dimasukkan ke sitemap
  if (effectiveCanonicalPath(resolved) !== resolved.canonicalPath) return false

  return (await countRoomListing(resolved.filters)) >= MIN_INDEXABLE_ROOMS
}

async function roomListingPaths() {
  const sites = await getPublicSites()
  const paths = new Set<string>(['/hotel'])

  for (const site of sites) {
    if (site.slug) paths.add(`/hotel/${site.slug}`)
  }

  // Hub kota hanya ada kalau satu kota punya lebih dari satu cabang
  const citySiteCount = new Map<string, number>()
  for (const site of sites) {
    if (site.citySlug) citySiteCount.set(site.citySlug, (citySiteCount.get(site.citySlug) ?? 0) + 1)
  }
  for (const [citySlug, count] of citySiteCount) {
    if (count > 1) paths.add(`/hotel/${citySlug}`)
  }

  // Tipe kamar per lokasi + per tipe di semua cabang, diambil dari internal link resolver
  for (const path of Array.from(paths)) {
    const segments = path.replace(/^\/hotel\/?/, '').split('/').filter(Boolean)
    const resolved = await resolveRoomListing(segments)
    if (resolved?.kind === 'listing') {
      resolved.links.roomTypes.forEach((link) => paths.add(link.path))
    }
  }

  const checks = await Promise.all(
    Array.from(paths).map(async (path) => ((await isIndexable(path)) ? path : null)),
  )
  return checks.filter((p): p is string => !!p)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const paths = await roomListingPaths()
    return paths.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: path === '/hotel' ? 0.9 : 0.8,
    }))
  } catch (err) {
    // Error internal Next (mis. render dinamis) jangan ditelan, nanti RLP hilang diam-diam dari sitemap
    unstable_rethrow(err)
    // BE tidak bisa dihubungi → sajikan sitemap kosong daripada error
    console.error('[sitemap] gagal generate URL RLP:', err)
    return []
  }
}
