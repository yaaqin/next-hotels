import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import { Suspense } from 'react'
import JsonLd from '@/src/components/organisms/roomListing/JsonLd'
import RelatedNews from '@/src/components/organisms/news/RelatedNews'
import { ArticleEngagementProvider, ArticleLikeCta, ArticleStats } from '@/src/components/organisms/news/ArticleEngagement'
import { getNewsArticle } from '@/src/services/news'
import { renderMarkdown } from '@/src/utils/markdown'
import { BRAND } from '../../hotel/hotel.helper'
import {
  articleCanonical,
  articleDescription,
  formatNewsDate,
  newsArticleJsonLd,
  newsBreadcrumbJsonLd,
  shownPublishDate,
} from '@/src/components/organisms/news/helpers'

type PageProps = { params: Promise<{ slug: string }> }

async function load(params: PageProps['params']) {
  const { slug } = await params
  return getNewsArticle(decodeURIComponent(slug))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await load(params)
  const a = resolved?.article
  if (!a) return {}

  const title = a.seoTitle || `${a.title} — ${BRAND}`
  const description = articleDescription(a)
  const canonical = articleCanonical(a)
  return {
    title,
    description,
    robots: a.metaRobots,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: a.seoTitle || a.title,
      description,
      url: canonical,
      publishedTime: shownPublishDate(a) ?? undefined,
      modifiedTime: a.updatedAt,
      tags: a.tags,
      ...(a.coverImage && { images: [{ url: a.coverImage, alt: a.coverAlt ?? a.title }] }),
    },
    twitter: { card: a.coverImage ? 'summary_large_image' : 'summary', title: a.seoTitle || a.title, description },
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const resolved = await load(params)
  if (!resolved) notFound()
  // Slug lama → 301 ke slug sekarang
  if (resolved.redirect !== null) permanentRedirect(`/news/${resolved.redirect}`)

  const a = resolved.article
  const published = shownPublishDate(a)
  // "Diperbarui" cuma muncul kalau beda hari dengan tanggal tayang
  const updated = formatNewsDate(a.updatedAt) !== formatNewsDate(published) ? a.updatedAt : null

  return (
    <div className="bg-white">
      <JsonLd data={newsBreadcrumbJsonLd(a)} />
      <JsonLd data={newsArticleJsonLd(a)} />
      <ArticleEngagementProvider slug={a.slug} viewCount={a.viewCount} likeCount={a.likeCount}>
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-500">
            <Link href="/" className="hover:underline">Beranda</Link> /{' '}
            <Link href="/news" className="hover:underline">Berita</Link>
          </nav>

          <header>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl">{a.title}</h1>
            <p className="mt-3 text-sm text-gray-500">
              <time dateTime={published ?? undefined}>{formatNewsDate(published)}</time>
              {updated && (
                <>
                  {' · '}Diperbarui <time dateTime={updated}>{formatNewsDate(updated)}</time>
                </>
              )}
            </p>
            <ArticleStats />
            {a.excerpt && <p className="mt-5 text-lg leading-relaxed text-gray-600">{a.excerpt}</p>}
          </header>

          {a.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={a.coverImage}
              alt={a.coverAlt ?? a.title}
              fetchPriority="high"
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}

          <div className="article-body mt-8" dangerouslySetInnerHTML={{ __html: renderMarkdown(a.content) }} />

          <ArticleLikeCta />

          {a.tags.length > 0 && (
            <footer className="mt-10 flex flex-wrap gap-2 border-t border-gray-100 pt-6">
              {a.tags.map((t) => (
                <Link
                  key={t}
                  href={`/news?tag=${encodeURIComponent(t)}`}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                >
                  #{t}
                </Link>
              ))}
            </footer>
          )}
        </article>
      </ArticleEngagementProvider>

      {/* Artikel terkait dimuat terpisah supaya isi artikel tidak menunggu */}
      <Suspense fallback={null}>
        <RelatedNews slug={a.slug} />
      </Suspense>
    </div>
  )
}
