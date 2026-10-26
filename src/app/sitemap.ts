import type { MetadataRoute } from 'next'
import { unstable_rethrow } from 'next/navigation'
import { countRoomListing, getPublicSites, resolveRoomListing } from '@/src/services/roomListing'
import { getNewsSitemap } from '@/src/services/news'
import { articleCanonical, articlePath, isIndexable as isArticleIndexable } from '@/src/components/organisms/news/helpers'
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

// Artikel yang indexable & canonical-nya ke dirinya sendiri
async function newsEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = await getNewsSitemap()
    const entries = articles
      .filter((a) => isArticleIndexable(a.metaRobots))
      .filter((a) => articleCanonical(a) === `${SITE_URL}${articlePath(a.slug)}`)
      .map((a) => ({
        url: `${SITE_URL}${articlePath(a.slug)}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    return [{ url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 }, ...entries]
  } catch (err) {
    console.error('[sitemap] gagal generate URL news:', err)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await newsEntries()
  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), priority: 1 },
    ...news,
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
    // Error internal Next (mis. render dinamis) jangan ditelan, nanti RLP hilang diam-diam dari sitemap
    unstable_rethrow(err)
    // BE tidak bisa dihubungi → tetap sajikan sitemap minimal daripada error
    console.error('[sitemap] gagal generate URL RLP:', err)
    return home
  }
}
