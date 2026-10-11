'use client'
import { NewsroomHeader } from '@/src/components/organisms/newsroom/shell'
import { Button, Card, Empty, Field, Modal, SegmentTabs, Skeleton, cx, inputClass } from '@/src/components/organisms/configPanel/ui'
import { ChartTable, LikesChart, ViewsChart, formatBucket } from '@/src/components/organisms/newsroom/reportCharts'
import { useArticleAnalytics } from '@/src/hooks/query/article'
import { AnalyticsArticle, AnalyticsRange, AnalyticsSpike, ArticleAnalytics } from '@/src/models/article'
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Download, ExternalLink, Info, Loader2, Minus, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { downloadNewsReport, getNewsExportLimit } from '@/src/services/article'
import { ReactNode, useState } from 'react'
import { formatDateTime } from './helpers'

const RANGES: { key: AnalyticsRange; label: string; prev: string }[] = [
  { key: '24h', label: '24 jam', prev: '24 jam sebelumnya' },
  { key: '7d', label: '7 hari', prev: '7 hari sebelumnya' },
  { key: '30d', label: '30 hari', prev: '30 hari sebelumnya' },
  { key: '90d', label: '90 hari', prev: '90 hari sebelumnya' },
]

const num = (n: number) => n.toLocaleString('id-ID')
const compact = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(n)

export default function NewsroomReportPage() {
  const [range, setRange] = useState<AnalyticsRange>('7d')
  const { data, isLoading, isFetching } = useArticleAnalytics(range)
  const report = data?.data
  const prevLabel = RANGES.find((r) => r.key === range)!.prev

  return (
    <>
      <NewsroomHeader
        back
        title="Laporan"
        subtitle="Performa artikel di /news: view, like, konten yang naik, dan tag"
        actions={<ExportButton />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SegmentTabs<AnalyticsRange> value={range} onChange={setRange} items={RANGES} />
        {report && (
          <span className="text-xs text-[var(--cp-muted)]">
            dibanding {prevLabel} · diperbarui {formatDateTime(report.to)}
          </span>
        )}
      </div>

      {isLoading || !report ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-80" />
        </div>
      ) : (
        // Ganti periode: data lama tetap tampil (redup) sampai data baru datang
        <div className={cx('space-y-4 transition-opacity', isFetching && 'opacity-60')}>
          <TrackingNotice report={report} />
          <Summary report={report} prevLabel={prevLabel} />

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardTitle title="View" subtitle={report.bucket === 'hour' ? 'Per jam (WIB)' : 'Per hari (WIB)'} />
              <ViewsChart data={report.timeline} bucket={report.bucket} />
              <ChartTable data={report.timeline} bucket={report.bucket} field="views" label="View" />
            </Card>
            <Card>
              <CardTitle title="Like" subtitle={report.bucket === 'hour' ? 'Per jam (WIB)' : 'Per hari (WIB)'} />
              <LikesChart data={report.timeline} bucket={report.bucket} />
              <ChartTable data={report.timeline} bucket={report.bucket} field="likes" label="Like" />
            </Card>
          </div>

          <TopContent report={report} />

          <div className="grid gap-4 xl:grid-cols-2">
            <FastStarts report={report} />
            <Spikes spikes={report.spikes} />
          </div>

          <TagReport report={report} />
        </div>
      )}
    </>
  )
}

// ── Download Excel ─────────────────────────────

const DAY_MS = 86_400_000
const shiftDate = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS) + 1

// Rentang maksimal diatur di config panel → Report App; BE tetap memvalidasi ulang
function ExportButton() {
  const [open, setOpen] = useState(false)
  const [limit, setLimit] = useState<{ maxDays: number; today: string } | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [busy, setBusy] = useState(false)

  const openModal = async () => {
    setOpen(true)
    try {
      const res = await getNewsExportLimit()
      setLimit(res.data)
      setTo(res.data.today)
      setFrom(shiftDate(res.data.today, -(Math.min(7, res.data.maxDays) - 1)))
    } catch {
      setOpen(false)
    }
  }

  const days = from && to ? daysBetween(from, to) : 0
  const error = !limit
    ? null
    : !from || !to
      ? 'Pilih tanggal awal & akhir'
      : days < 1
        ? 'Tanggal awal harus sebelum tanggal akhir'
        : to > limit.today
          ? 'Tanggal akhir tidak boleh melewati hari ini'
          : days > limit.maxDays
            ? `Maksimal ${limit.maxDays} hari (dipilih ${days} hari)`
            : null

  const submit = async () => {
    if (error || busy) return
    setBusy(true)
    try {
      await downloadNewsReport(from, to)
      toast.success('Laporan diunduh')
      setOpen(false)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={openModal}>
        <Download size={15} /> Download Excel
      </Button>
      <Modal open={open} title="Download laporan (Excel)" onClose={() => setOpen(false)}>
        {!limit ? (
          <Skeleton className="h-40" />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dari">
                <input type="date" className={inputClass} value={from} max={to || limit.today} onChange={(e) => setFrom(e.target.value)} />
              </Field>
              <Field label="Sampai">
                <input type="date" className={inputClass} value={to} max={limit.today} onChange={(e) => setTo(e.target.value)} />
              </Field>
            </div>
            <p className={cx('text-xs', error ? 'text-[var(--cp-danger)]' : 'text-[var(--cp-muted)]')}>
              {error ?? `${days} hari · maksimal ${limit.maxDays} hari per file`}
            </p>
            <p className="text-[11px] text-[var(--cp-muted)]">
              Isi file: ringkasan, view & like harian, semua artikel, tag, kombinasi tag, lonjakan, dan start cepat.
            </p>
            <Button className="w-full" disabled={!!error || busy} onClick={submit}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              {busy ? 'Menyiapkan file…' : 'Download'}
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}

// ── Bagian ─────────────────────────────────────

function CardTitle({ title, subtitle, action }: { title: string; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-base font-medium">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-[var(--cp-muted)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// View per jam baru dicatat sejak fitur laporan aktif
function TrackingNotice({ report }: { report: ArticleAnalytics }) {
  const start = report.trackingStart
  if (start && new Date(start) <= new Date(report.prevFrom)) return null
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[var(--cp-line)] bg-[var(--cp-card)] px-4 py-3 text-xs text-[var(--cp-muted)]">
      <Info size={15} className="mt-0.5 shrink-0" />
      <p>
        {start
          ? `Data view per waktu mulai tercatat ${formatDateTime(start)}. Angka sebelum itu belum ada, jadi perbandingan dengan periode sebelumnya belum lengkap.`
          : 'Belum ada view yang tercatat. Laporan terisi otomatis begitu artikel di /news mulai dibaca.'}
      </p>
    </div>
  )
}

function Delta({ now, prev, prevLabel }: { now: number; prev: number; prevLabel: string }) {
  const diff = now - prev
  const pct = prev > 0 ? Math.round((diff / prev) * 100) : null
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : Minus
  return (
    <p
      className={cx(
        'mt-3 flex items-center gap-1 text-xs',
        diff > 0 ? 'text-[#0ca30c]' : diff < 0 ? 'text-[var(--cp-danger)]' : 'text-[var(--cp-muted)]',
      )}
    >
      <Icon size={14} />
      <span className="font-medium">
        {diff > 0 ? '+' : ''}
        {num(diff)}
        {pct !== null && ` (${diff > 0 ? '+' : ''}${pct}%)`}
      </span>
      <span className="text-[var(--cp-muted)]">vs {prevLabel}</span>
    </p>
  )
}

function StatTile({ label, value, children }: { label: string; value: ReactNode; children?: ReactNode }) {
  return (
    <Card className="!p-5">
      <p className="text-xs text-[var(--cp-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-light sm:text-4xl">{value}</p>
      {children}
    </Card>
  )
}

function Summary({ report, prevLabel }: { report: ArticleAnalytics; prevLabel: string }) {
  const s = report.summary
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile label="Total view" value={num(s.views)}>
        <Delta now={s.views} prev={s.viewsPrev} prevLabel={prevLabel} />
      </StatTile>
      <StatTile label="Like baru" value={num(s.likes)}>
        <Delta now={s.likes} prev={s.likesPrev} prevLabel={prevLabel} />
      </StatTile>
      <StatTile
        label="Artikel yang dilihat"
        value={
          <>
            {num(s.viewedArticles)}
            <span className="ml-1 text-base text-[var(--cp-muted)]">/ {num(s.totalArticles)}</span>
          </>
        }
      >
        <p className="mt-3 text-xs text-[var(--cp-muted)]">dari semua artikel yang sedang tayang</p>
      </StatTile>
      <StatTile label="Artikel baru tayang" value={num(s.published)}>
        <p className="mt-3 text-xs text-[var(--cp-muted)]">rata-rata {compact(s.viewedArticles ? s.views / s.viewedArticles : 0)} view per artikel dilihat</p>
      </StatTile>
    </div>
  )
}

const ArticleLink = ({ a }: { a: { slug: string; title: string } }) => (
  <a
    href={`/news/${a.slug}`}
    target="_blank"
    rel="noreferrer"
    className="group inline-flex min-w-0 items-center gap-1.5 hover:text-[var(--cp-accent)]"
  >
    <span className="line-clamp-2">{a.title}</span>
    <ExternalLink size={12} className="shrink-0 opacity-0 transition group-hover:opacity-100" />
  </a>
)

const TagList = ({ tags }: { tags: string[] }) =>
  tags.length ? (
    <p className="mt-1 truncate text-[11px] text-[var(--cp-muted)]">{tags.map((t) => `#${t}`).join(' ')}</p>
  ) : null

type TopTab = 'views' | 'risers' | 'likes'

function TopContent({ report }: { report: ArticleAnalytics }) {
  const [tab, setTab] = useState<TopTab>('views')
  const rows = tab === 'views' ? report.topViews : tab === 'risers' ? report.risers : report.topLikes

  const metric = (a: AnalyticsArticle) => {
    if (tab === 'likes') return { value: a.likes, prev: a.likesPrev, unit: 'like' }
    return { value: a.views, prev: a.viewsPrev, unit: 'view' }
  }

  return (
    <Card>
      <CardTitle
        title="Konten teratas"
        subtitle={
          tab === 'risers'
            ? 'Kenaikan view terbesar dibanding periode sebelumnya'
            : tab === 'views'
              ? 'View terbanyak di periode ini'
              : 'Like baru terbanyak di periode ini'
        }
        action={
          <SegmentTabs<TopTab>
            value={tab}
            onChange={setTab}
            items={[
              { key: 'views', label: 'Paling dilihat' },
              { key: 'risers', label: 'Paling naik' },
              { key: 'likes', label: 'Paling disukai' },
            ]}
          />
        }
      />
      {!rows.length ? (
        <Empty dark>Belum ada data di periode ini.</Empty>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-xs text-[var(--cp-muted)]">
              <tr>
                <th className="w-8 pb-2 font-normal">#</th>
                <th className="pb-2 font-normal">Artikel</th>
                <th className="pb-2 text-right font-normal">{tab === 'likes' ? 'Like' : 'View'}</th>
                <th className="pb-2 text-right font-normal">Sebelumnya</th>
                <th className="pb-2 text-right font-normal">Perubahan</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const m = metric(a)
                const diff = m.value - m.prev
                return (
                  <tr key={a.slug} className="border-t border-[var(--cp-line)] align-top">
                    <td className="py-3 text-[var(--cp-muted)] tabular-nums">{i + 1}</td>
                    <td className="py-3 pr-4">
                      <ArticleLink a={a} />
                      <TagList tags={a.tags} />
                    </td>
                    <td className="py-3 text-right font-medium tabular-nums">{num(m.value)}</td>
                    <td className="py-3 text-right text-[var(--cp-muted)] tabular-nums">{num(m.prev)}</td>
                    <td
                      className={cx(
                        'py-3 text-right tabular-nums',
                        diff > 0 ? 'text-[#0ca30c]' : diff < 0 ? 'text-[var(--cp-danger)]' : 'text-[var(--cp-muted)]',
                      )}
                    >
                      {diff > 0 ? '+' : ''}
                      {num(diff)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

function FastStarts({ report }: { report: ArticleAnalytics }) {
  const rows = report.fastStarts
  const max = Math.max(1, ...rows.map((r) => r.first6h))
  return (
    <Card>
      <CardTitle title="Start tercepat" subtitle="View di 6 & 24 jam pertama sejak tayang, untuk artikel yang tayang di periode ini" />
      {!rows.length ? (
        <Empty dark>Belum ada artikel baru dengan data jam pertama.</Empty>
      ) : (
        <ul className="space-y-3">
          {rows.map((a) => (
            <li key={a.slug} className="rounded-2xl bg-[var(--cp-card-2)]/60 p-4">
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <ArticleLink a={a} />
                  <p className="mt-1 text-[11px] text-[var(--cp-muted)]">Tayang {formatDateTime(a.publishedAt)}</p>
                </div>
                {a.running && (
                  <span className="shrink-0 rounded-full border border-[var(--cp-line)] px-2 py-0.5 text-[10px] text-[var(--cp-muted)]">
                    6 jam belum lewat
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {/* Meter: panjang = view 6 jam pertama relatif terhadap yang tertinggi di daftar */}
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#184f95]/40">
                  <div className="h-full rounded-full bg-[#3987e5]" style={{ width: `${(a.first6h / max) * 100}%` }} />
                </div>
                <p className="w-40 shrink-0 text-right text-xs tabular-nums">
                  <span className="font-semibold">{num(a.first6h)}</span>
                  <span className="text-[var(--cp-muted)]"> / 6 jam · </span>
                  <span className="font-semibold">{num(a.first24h)}</span>
                  <span className="text-[var(--cp-muted)]"> / 24 jam</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Spikes({ spikes }: { spikes: AnalyticsSpike[] }) {
  return (
    <Card>
      <CardTitle
        title="Lonjakan konten"
        subtitle="Artikel lama yang view hariannya tiba-tiba naik ≥3× dari rata-rata 7 hari sebelumnya, dan apakah artikel lain dengan tag yang sama ikut naik"
      />
      {!spikes.length ? (
        <Empty dark>Tidak ada lonjakan di periode ini.</Empty>
      ) : (
        <ul className="space-y-3">
          {spikes.map((s) => (
            <li key={s.slug} className="rounded-2xl bg-[var(--cp-card-2)]/60 p-4">
              <div className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <ArticleLink a={s} />
                  <p className="mt-1 text-[11px] text-[var(--cp-muted)]">
                    {formatBucket(`${s.day}T00:00:00+07:00`, 'day', true)} · {num(s.views)} view, biasanya ±{num(s.baseline)}/hari
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--cp-accent)] px-2.5 py-1 text-[11px] font-semibold text-[var(--cp-accent-ink)]">
                  <Zap size={12} /> {s.ratio}×
                </span>
              </div>
              {s.halo.length > 0 && (
                <div className="mt-3 border-t border-[var(--cp-line)] pt-3">
                  <p className="mb-2 text-[11px] text-[var(--cp-muted)]">Artikel lain dengan tag yang sama di hari itu</p>
                  <ul className="space-y-1.5 text-xs">
                    {s.halo.map((h) => (
                      <li key={h.tag} className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">#{h.tag}</span>
                        {h.articles === 0 ? (
                          <span className="text-[var(--cp-muted)]">tidak ada artikel lain</span>
                        ) : h.lifted ? (
                          <span className="inline-flex items-center gap-1 text-[#0ca30c]">
                            <CheckCircle2 size={13} />
                            ikut naik{h.ratio !== null && ` ${h.ratio}×`} · {num(h.views)} view dari {h.articles} artikel
                          </span>
                        ) : (
                          <span className="text-[var(--cp-muted)]">
                            tidak ikut naik · {num(h.views)} view dari {h.articles} artikel
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

type TagSort = 'views' | 'avgViews' | 'avgFirst24h' | 'articles'

function TagReport({ report }: { report: ArticleAnalytics }) {
  const [sort, setSort] = useState<TagSort>('views')
  const tags = [...report.tags].sort((a, b) => (b[sort] ?? -1) - (a[sort] ?? -1))
  const maxViews = Math.max(1, ...report.tags.map((t) => t.views))

  const SortHead = ({ k, children }: { k: TagSort; children: ReactNode }) => (
    <th className="pb-2 text-right font-normal">
      <button
        onClick={() => setSort(k)}
        aria-pressed={sort === k}
        className={cx('hover:text-[var(--cp-text)]', sort === k && 'font-medium text-[var(--cp-text)]')}
      >
        {children}
        {sort === k && ' ↓'}
      </button>
    </th>
  )

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Card>
        <CardTitle
          title="Performa tag"
          subtitle="Tag yang paling sering dipakai dan paling banyak dibaca. Klik judul kolom untuk mengurutkan."
        />
        {!tags.length ? (
          <Empty dark>Belum ada artikel bertag.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="text-left text-xs text-[var(--cp-muted)]">
                <tr>
                  <th className="pb-2 font-normal">Tag</th>
                  <SortHead k="articles">Dipakai</SortHead>
                  <SortHead k="views">View</SortHead>
                  <th className="pb-2 text-right font-normal">Perubahan</th>
                  <SortHead k="avgViews">Rata-rata / artikel</SortHead>
                  <SortHead k="avgFirst24h">Rata-rata 24 jam pertama</SortHead>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {tags.map((t) => {
                  const diff = t.views - t.viewsPrev
                  return (
                    <tr key={t.tag} className="border-t border-[var(--cp-line)]">
                      <td className="py-2.5 pr-3">
                        <p className="font-medium">#{t.tag}</p>
                        <div className="mt-1.5 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-[#184f95]/40">
                          <div className="h-full rounded-full bg-[#3987e5]" style={{ width: `${(t.views / maxViews) * 100}%` }} />
                        </div>
                      </td>
                      <td className="py-2.5 text-right">{num(t.articles)}</td>
                      <td className="py-2.5 text-right font-medium">{num(t.views)}</td>
                      <td
                        className={cx(
                          'py-2.5 text-right',
                          diff > 0 ? 'text-[#0ca30c]' : diff < 0 ? 'text-[var(--cp-danger)]' : 'text-[var(--cp-muted)]',
                        )}
                      >
                        {diff > 0 ? '+' : ''}
                        {num(diff)}
                      </td>
                      <td className="py-2.5 text-right">{num(t.avgViews)}</td>
                      <td className="py-2.5 text-right">{t.avgFirst24h === null ? '–' : num(t.avgFirst24h)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle
          title="Kombinasi tag"
          subtitle="Pasangan tag yang dipakai bersama di ≥2 artikel, diurutkan dari rata-rata view per artikel tertinggi"
        />
        {!report.tagPairs.length ? (
          <Empty dark>Belum ada pasangan tag yang dipakai di 2 artikel atau lebih.</Empty>
        ) : (
          <ul className="space-y-2">
            {report.tagPairs.map((p, i) => (
              <li key={p.tags.join('+')} className="flex items-center gap-3 rounded-2xl bg-[var(--cp-card-2)]/60 px-4 py-3 text-sm">
                <span className="w-5 text-xs text-[var(--cp-muted)] tabular-nums">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{p.tags.map((t) => `#${t}`).join(' + ')}</span>
                <span className="shrink-0 text-right text-xs tabular-nums">
                  <span className="font-semibold">{num(p.avgViews)}</span>
                  <span className="text-[var(--cp-muted)]"> view/artikel · {p.articles} artikel</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
