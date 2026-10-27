import type { MetadataRoute } from 'next'
import { getNewsSitemap } from '@/src/services/news'
import { articleCanonical, articlePath, isIndexable } from '@/src/components/organisms/news/helpers'
import { SITE_URL } from '../hotel/hotel.helper'

// /news/sitemap.xml — bagian news dari sitemap index (/sitemap.xml)
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const index: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ]

  try {
    const articles = await getNewsSitemap()
    // Artikel yang indexable & canonical-nya ke dirinya sendiri
    const entries = articles
      .filter((a) => isIndexable(a.metaRobots))
      .filter((a) => articleCanonical(a) === `${SITE_URL}${articlePath(a.slug)}`)
      .map((a) => ({
        url: `${SITE_URL}${articlePath(a.slug)}`,
        lastModified: new Date(a.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    return [...index, ...entries]
  } catch (err) {
    console.error('[sitemap] gagal generate URL news:', err)
    return index
  }
}
