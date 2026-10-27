import { SITE_URL } from '../(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

// /sitemap.xml = sitemap index. Isi URL-nya ada di sitemap per bagian:
// halaman umum (/sitemap-pages.xml), RLP (hotel/sitemap.ts), news (news/sitemap.ts)
export const dynamic = 'force-static'

const SITEMAPS = ['/sitemap-pages.xml', '/hotel/sitemap.xml', '/news/sitemap.xml']

export function GET() {
  const body = SITEMAPS.map((path) => `<sitemap><loc>${SITE_URL}${path}</loc></sitemap>`).join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
