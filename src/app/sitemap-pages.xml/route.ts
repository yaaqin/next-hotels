import { SITE_URL } from '../(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

// Halaman umum di luar RLP & news. Bagian dari sitemap index (/sitemap.xml)
export const revalidate = 3600

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>${SITE_URL}</loc><lastmod>${new Date().toISOString()}</lastmod><priority>1</priority></url>
</urlset>
`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } })
}
