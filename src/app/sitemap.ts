import type { MetadataRoute } from 'next'
import { getPublicSites, resolveRoomListing, searchRoomListing } from '@/src/services/roomListing'
import {
  effectiveCanonicalPath,
  MIN_INDEXABLE_ROOMS,
  SITE_URL,
} from './(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

export const revalidate = 3600

// Halaman RLP yang masuk sitemap = yang indexable saja (cukup kamar, bukan alias/redirect)
async function isIndexable(path: string) {
  const segments = path.replace(/^\/hotel\/?/, '').split('/').filter(Boolean)
  const resolved = await resolveRoomListing(segments)
  if (!resolved || resolved.redirect || resolved.kind !== 'listing') return false
  // Halaman yang canonical-nya menunjuk ke halaman lain tidak dimasukkan ke sitemap
  if (effectiveCanonicalPath(resolved) !== resolved.canonicalPath) return false

  const result = await searchRoomListing({
    site_codes: resolved.filters.siteCodes,
    room_type_ids: resolved.filters.roomTypeIds,
    promo: resolved.filters.promo,
    page_size: 1,
  })
  return result.meta.total >= MIN_INDEXABLE_ROOMS
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
  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
  ]

  try {
    const paths = await roomListingPaths()
    return [
      ...home,
      ...paths.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: path === '/hotel' ? 0.9 : 0.8,
      })),
    ]
  } catch (err) {
    // BE tidak bisa dihubungi → tetap sajikan sitemap minimal daripada error
    console.error('[sitemap] gagal generate URL RLP:', err)
    return home
  }
}
