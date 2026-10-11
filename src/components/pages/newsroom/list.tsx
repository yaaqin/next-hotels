'use client'
import { NewsroomHeader } from '@/src/components/organisms/newsroom/shell'
import {
  Avatar,
  Button,
  Chip,
  Empty,
  FilterSearch,
  ListRow,
  Paper,
  SegmentTabs,
  Skeleton,
} from '@/src/components/organisms/configPanel/ui'
import { STATUS_LABEL } from '@/src/constans/newsroom'
import { useArticles } from '@/src/hooks/query/article'
import { ArticleListItem, ArticleStatus } from '@/src/models/article'
import { BarChart3, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { STATUS_TONE, formatDateTime } from './helpers'

type Tab = 'ALL' | ArticleStatus
const STATUSES: ArticleStatus[] = ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'TAKEDOWN']
const PAGE_SIZE = 20

// Keterangan waktu yang paling relevan per status
const timeLabel = (a: ArticleListItem) => {
  if (a.status === 'SCHEDULED' || a.status === 'PUBLISHED') return `Tayang ${formatDateTime(a.publishAt)}`
  return `Diubah ${formatDateTime(a.updatedAt)}`
}

export default function NewsroomListPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('ALL')
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => setPage(1), [tab, debounced])

  const { data, isLoading } = useArticles({
    status: tab === 'ALL' ? undefined : tab,
    search: debounced || undefined,
    page,
    pageSize: PAGE_SIZE,
  })

  const list = data?.data
  const counts = list?.counts
  const total = list?.meta.total ?? 0
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const allCount = counts ? STATUSES.reduce((sum, s) => sum + counts[s], 0) : undefined

  return (
    <>
      <NewsroomHeader
        title="Artikel"
        subtitle="Tulis, jadwalkan, dan kelola artikel yang tampil di /news"
        actions={
          <>
            <Button variant="ghost" onClick={() => router.push('/newsroom/report')}>
              <BarChart3 size={15} /> Laporan
            </Button>
            <Button onClick={() => router.push('/newsroom/create')}>
              <Plus size={15} /> Tulis artikel
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SegmentTabs<Tab>
          value={tab}
          onChange={setTab}
          items={[
            { key: 'ALL', label: 'Semua', count: allCount },
            ...STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s], count: counts?.[s] })),
          ]}
        />
        <FilterSearch value={search} onChange={setSearch} placeholder="Cari judul atau slug" />
      </div>

      <Paper
        title={tab === 'ALL' ? 'Semua artikel' : STATUS_LABEL[tab]}
        action={<span className="text-xs text-[var(--cp-ink-muted)]">{total} artikel</span>}
      >
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full bg-black/5" />
            ))}
          </div>
        ) : !list?.items.length ? (
          <Empty>
            {debounced ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel di sini.'}
          </Empty>
        ) : (
          <div className="space-y-1">
            {list.items.map((a) => (
              <ListRow
                key={a.id}
                onClick={() => router.push(`/newsroom/${a.id}`)}
                avatar={
                  a.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.coverImage} alt="" className="h-10 w-14 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <Avatar name={a.title} size={40} />
                  )
                }
                title={a.title}
                subtitle={`/news/${a.slug} · ${timeLabel(a)} · oleh ${a.editor?.username ?? a.author.username}`}
                badge={<Chip tone={STATUS_TONE[a.status]}>{STATUS_LABEL[a.status]}</Chip>}
              />
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-[var(--cp-ink-muted)]">
            <span>
              Halaman {page} / {lastPage}
            </span>
            <button
              aria-label="Halaman sebelumnya"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cp-paper-line)] disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              aria-label="Halaman berikutnya"
              disabled={page >= lastPage}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--cp-paper-line)] disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </Paper>
    </>
  )
}
