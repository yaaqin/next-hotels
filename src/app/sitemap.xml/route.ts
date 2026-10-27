import { sitemapIndexResponse } from '@/src/utils/sitemapXml'
import { SITE_URL } from '../(publicAccess)/(publicDashboard2)/hotel/hotel.helper'
import { rlpSitemapCount, roomListingPaths } from '../(publicAccess)/(publicDashboard2)/hotel/sitemap.helper'

// /sitemap.xml = sitemap index. Isi URL-nya ada di sitemap per bagian:
// halaman umum (/sitemap-pages.xml), RLP (/hotel/sitemap/{n}.xml), news (news/sitemap.ts).
// Jumlah file RLP ikut data, jadi index ikut di-expire tag 'room-listing'.
export const revalidate = 3600

export async function GET() {
  const rlpCount = rlpSitemapCount((await roomListingPaths()).length)
  return sitemapIndexResponse(
    [
      '/sitemap-pages.xml',
      ...Array.from({ length: rlpCount }, (_, i) => `/hotel/sitemap/${i + 1}.xml`),
      '/news/sitemap.xml',
    ].map((path) => `${SITE_URL}${path}`),
  )
}
