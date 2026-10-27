// XML sitemap untuk route handler (sitemap yang tidak bisa pakai metadata route sitemap.ts)

type SitemapUrl = {
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const xmlResponse = (xml: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${xml}\n`, {
    headers: { 'Content-Type': 'application/xml' },
  })

export const urlsetResponse = (urls: SitemapUrl[]) =>
  xmlResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) =>
    [
      '<url>',
      `<loc>${escapeXml(u.url)}</loc>`,
      u.lastModified && `<lastmod>${u.lastModified.toISOString()}</lastmod>`,
      u.changeFrequency && `<changefreq>${u.changeFrequency}</changefreq>`,
      u.priority !== undefined && `<priority>${u.priority}</priority>`,
      '</url>',
    ]
      .filter(Boolean)
      .join(''),
  )
  .join('\n')}
</urlset>`)

export const sitemapIndexResponse = (locs: string[]) =>
  xmlResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs.map((loc) => `<sitemap><loc>${escapeXml(loc)}</loc></sitemap>`).join('\n')}
</sitemapindex>`)
