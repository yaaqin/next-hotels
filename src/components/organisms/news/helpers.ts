import { PublicArticle } from '@/src/models/article'
import { BRAND, SITE_URL } from '@/src/app/(publicAccess)/(publicDashboard2)/hotel/hotel.helper'
import { markdownToPlain } from '@/src/utils/markdown'

// Tanggal dirender di server → zona waktu dikunci supaya tidak tergantung TZ mesin
export const formatNewsDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta',
      })
    : ''

export const articlePath = (slug: string) => `/news/${slug}`

// Canonical custom boleh path ("/news/x") atau URL absolut; kosong = URL artikel sendiri
export const articleCanonical = (a: Pick<PublicArticle, 'slug' | 'canonicalUrl'>) => {
  if (!a.canonicalUrl) return `${SITE_URL}${articlePath(a.slug)}`
  return a.canonicalUrl.startsWith('/') ? `${SITE_URL}${a.canonicalUrl}` : a.canonicalUrl
}

export const articleDescription = (a: PublicArticle) =>
  a.metaDescription || a.excerpt || markdownToPlain(a.content)

export const isIndexable = (metaRobots: string) => !metaRobots.includes('noindex')

// Tanggal tayang yang ditampilkan: pertama kali tayang (tidak berubah saat diedit)
export const shownPublishDate = (a: { publishedAt: string | null; publishAt: string | null }) =>
  a.publishedAt ?? a.publishAt

export function newsArticleJsonLd(a: PublicArticle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: articleDescription(a),
    ...(a.coverImage && { image: [a.coverImage] }),
    datePublished: shownPublishDate(a),
    dateModified: a.updatedAt,
    mainEntityOfPage: articleCanonical(a),
    keywords: a.tags.join(', ') || undefined,
    author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
  }
}

export function newsBreadcrumbJsonLd(a: Pick<PublicArticle, 'title' | 'slug'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Berita', item: `${SITE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: a.title, item: `${SITE_URL}${articlePath(a.slug)}` },
    ],
  }
}
