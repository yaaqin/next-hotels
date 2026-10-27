import { urlsetResponse } from '@/src/utils/sitemapXml'
import { SITE_URL } from '../(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

// Halaman umum di luar RLP & news. Bagian dari sitemap index (/sitemap.xml)
export const revalidate = 3600

export function GET() {
  return urlsetResponse([{ url: SITE_URL, lastModified: new Date(), priority: 1 }])
}
