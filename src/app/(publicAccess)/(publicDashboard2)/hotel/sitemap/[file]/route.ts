import { urlsetResponse } from '@/src/utils/sitemapXml'
import { SITE_URL } from '../../hotel.helper'
import { RLP_SITEMAP_SIZE, rlpSitemapCount, roomListingPaths } from '../../sitemap.helper'

// /hotel/sitemap/{1..n}.xml — bagian RLP dari sitemap index (/sitemap.xml), RLP_SITEMAP_SIZE URL per file.
// Route handler (bukan sitemap.ts + generateSitemaps) karena generateSitemaps hanya menyediakan
// file yang ada saat build — file baru akibat RLP bertambah setelah deploy akan 404.
export const revalidate = 3600

export function generateStaticParams() {
  return []
}

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const match = /^(\d+)\.xml$/.exec((await ctx.params).file)
  const page = match ? Number(match[1]) : 0

  const paths = await roomListingPaths()
  if (page < 1 || page > rlpSitemapCount(paths.length)) return new Response('Not Found', { status: 404 })

  const start = (page - 1) * RLP_SITEMAP_SIZE
  return urlsetResponse(
    paths.slice(start, start + RLP_SITEMAP_SIZE).map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: path === '/hotel' ? 0.9 : 0.8,
    })),
  )
}
