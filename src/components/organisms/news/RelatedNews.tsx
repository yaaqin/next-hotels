import { PublicArticleItem } from '@/src/models/article'
import { getNewsRelated } from '@/src/services/news'
import TrackedNewsLink from './TrackedNewsLink'
import { formatNewsDate, shownPublishDate } from './helpers'

// Bagian bawah /news/[slug]: rekomendasi tag serupa, pilihan pembaca lain, terbaru, dan acak.
// Semua link dicatat sebagai klik dari artikel ini (dasar "Mungkin kamu juga suka").
export default async function RelatedNews({ slug }: { slug: string }) {
  const { latest, similar, alsoLiked, others } = await getNewsRelated(slug)
  if (!latest.length && !similar.length && !alsoLiked.length && !others.length) return null

  return (
    <section aria-label="Artikel lainnya" className="border-t border-gray-100 bg-[#f5f4f0]">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:py-16">
        <CardRow from={slug} title="Rekomendasi untukmu" subtitle="Topik serupa dengan artikel ini" items={similar} />
        <CardRow
          from={slug}
          title="Mungkin kamu juga suka"
          subtitle="Dibaca pembaca lain setelah artikel ini"
          items={alsoLiked}
        />
        {(latest.length > 0 || others.length > 0) && (
          <div className="grid gap-10 lg:grid-cols-2">
            <CompactList from={slug} title="Terbaru" items={latest} />
            <CompactList from={slug} title="Lainnya" items={others} />
          </div>
        )}
      </div>
    </section>
  )
}

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

function Cover({ a, className }: { a: PublicArticleItem; className: string }) {
  return a.coverImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={a.coverImage} alt={a.coverAlt ?? ''} loading="lazy" className={`object-cover ${className}`} />
  ) : (
    <div className={`bg-gradient-to-br from-blue-100 to-blue-200 ${className}`} />
  )
}

// Kartu bergambar — geser horizontal di HP, 5 kolom di desktop
function CardRow({
  from,
  title,
  subtitle,
  items,
}: {
  from: string
  title: string
  subtitle: string
  items: PublicArticleItem[]
}) {
  if (!items.length) return null
  return (
    <div>
      <Heading title={title} subtitle={subtitle} />
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
        {items.map((a) => (
          <li
            key={a.slug}
            className="group w-60 shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-md lg:w-auto"
          >
            <TrackedNewsLink from={from} to={a.slug} className="flex h-full flex-col">
              <Cover a={a} className="aspect-[16/9] w-full" />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700">
                  {a.title}
                </h3>
                <time className="mt-auto pt-3 text-xs text-gray-500" dateTime={shownPublishDate(a) ?? undefined}>
                  {formatNewsDate(shownPublishDate(a))}
                </time>
              </div>
            </TrackedNewsLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Daftar ringkas dengan thumbnail kecil
function CompactList({ from, title, items }: { from: string; title: string; items: PublicArticleItem[] }) {
  if (!items.length) return null
  return (
    <div>
      <Heading title={title} />
      <ul className="divide-y divide-gray-200/70 rounded-2xl bg-white px-4 shadow-sm ring-1 ring-black/5">
        {items.map((a) => (
          <li key={a.slug}>
            <TrackedNewsLink from={from} to={a.slug} className="group flex items-center gap-4 py-3">
              <Cover a={a} className="h-14 w-20 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug text-gray-900 group-hover:text-blue-700">
                  {a.title}
                </h3>
                <time className="mt-1 block text-xs text-gray-500" dateTime={shownPublishDate(a) ?? undefined}>
                  {formatNewsDate(shownPublishDate(a))}
                </time>
              </div>
            </TrackedNewsLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
