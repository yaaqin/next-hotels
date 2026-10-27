import { unstable_rethrow } from 'next/navigation'
import { countRoomListing, getPublicSites, resolveRoomListing } from '@/src/services/roomListing'
import { effectiveCanonicalPath, MIN_INDEXABLE_ROOMS } from './hotel.helper'

// Jumlah URL per file sitemap RLP (/hotel/sitemap/{n}.xml); sisanya lanjut ke file berikutnya
export const RLP_SITEMAP_SIZE = 6

// Halaman RLP yang masuk sitemap = yang indexable saja (cukup kamar, bukan alias/redirect)
async function isIndexable(path: string) {
  const segments = path.replace(/^\/hotel\/?/, '').split('/').filter(Boolean)
  const resolved = await resolveRoomListing(segments)
  if (!resolved || resolved.redirect || resolved.kind !== 'listing') return false
  // Halaman yang canonical-nya menunjuk ke halaman lain tidak dimasukkan ke sitemap
  if (effectiveCanonicalPath(resolved) !== resolved.canonicalPath) return false

  return (await countRoomListing(resolved.filters)) >= MIN_INDEXABLE_ROOMS
}

async function collectPaths() {
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

// Semua path RLP indexable. Dipakai sitemap RLP dan sitemap index (untuk hitung jumlah file).
export async function roomListingPaths() {
  try {
    return await collectPaths()
  } catch (err) {
    // Error internal Next (mis. render dinamis) jangan ditelan, nanti RLP hilang diam-diam dari sitemap
    unstable_rethrow(err)
    // BE tidak bisa dihubungi → anggap kosong daripada error
    console.error('[sitemap] gagal generate URL RLP:', err)
    return []
  }
}

// Minimal 1 file supaya /hotel/sitemap/1.xml selalu ada
export const rlpSitemapCount = (total: number) => Math.max(1, Math.ceil(total / RLP_SITEMAP_SIZE))
