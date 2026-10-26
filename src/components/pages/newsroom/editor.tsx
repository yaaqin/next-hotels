'use client'
import { NewsroomHeader } from '@/src/components/organisms/newsroom/shell'
import { Button, Card, Chip, Field, Modal, inputClass } from '@/src/components/organisms/configPanel/ui'
import {
  ARTICLE_MAX_TAGS,
  META_DESCRIPTION_LIMIT,
  META_ROBOTS_OPTIONS,
  SEO_TITLE_LIMIT,
  STATUS_LABEL,
} from '@/src/constans/newsroom'
import {
  useCreateArticle,
  usePublishArticle,
  useRestoreArticle,
  useScheduleArticle,
  useTakedownArticle,
  useUnscheduleArticle,
  useArticleTags,
  useUpdateArticle,
  useUploadArticleImage,
} from '@/src/hooks/query/article'
import { ArticleDetail, ArticleFields, PublishMode } from '@/src/models/article'
import { markdownToPlain, renderMarkdown } from '@/src/utils/markdown'
import { SITE_URL } from '@/src/app/(publicAccess)/(publicDashboard2)/hotel/hotel.helper'
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Upload,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { STATUS_TONE, formatDateTime, localInputToIso, toLocalInput } from './helpers'

const textareaClass = inputClass.replace('h-11', 'min-h-[88px] py-3')

// Sama dengan toSlug di BE (src/common/utils/slug.util.ts)
const toSlug = (v: string) =>
  v
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Default alt text cover: "cover-{slug}"
const autoAlt = (slug: string) => (slug ? `cover-${slug}` : '')

const fromArticle = (a?: ArticleDetail): ArticleFields => ({
  title: a?.title ?? '',
  slug: a?.slug ?? '',
  excerpt: a?.excerpt ?? '',
  content: a?.content ?? '',
  coverImage: a?.coverImage ?? '',
  coverAlt: a?.coverAlt ?? '',
  tags: a?.tags ?? [],
  seoTitle: a?.seoTitle ?? '',
  metaDescription: a?.metaDescription ?? '',
  metaRobots: a?.metaRobots ?? 'index,follow',
  canonicalUrl: a?.canonicalUrl ?? '',
})

export default function ArticleEditor({ article, children }: { article?: ArticleDetail; children?: ReactNode }) {
  const router = useRouter()
  const isEdit = !!article
  const initial = useMemo(() => fromArticle(article), [article])
  const [form, setForm] = useState<ArticleFields>(initial)
  // Slug ikut judul sampai diedit manual (hanya saat buat baru — slug artikel lama jangan berubah diam-diam)
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [mode, setMode] = useState<PublishMode>('DRAFT')
  const [publishAt, setPublishAt] = useState('')

  const set = <K extends keyof ArticleFields>(key: K, value: ArticleFields[K]) =>
    setForm((f) => {
      const next = {
        ...f,
        [key]: value,
        ...(key === 'title' && !slugTouched && { slug: toSlug(value as string) }),
      }
      // Alt cover ikut slug selama masih kosong / masih nilai default
      if (next.slug !== f.slug && (!f.coverAlt || f.coverAlt === autoAlt(f.slug))) {
        next.coverAlt = autoAlt(next.slug)
      }
      return next
    })

  // Alt kosong saat simpan → pakai default (slug kosong = BE membuat slug dari judul)
  const payload = () => ({ ...form, coverAlt: form.coverAlt || autoAlt(toSlug(form.slug || form.title)) })

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)

  const create = useCreateArticle()
  const update = useUpdateArticle(article?.id ?? '')

  const validate = () => {
    if (!form.title.trim()) return 'Judul wajib diisi'
    if (!form.content.trim()) return 'Isi artikel wajib diisi'
    return null
  }

  const validateSchedule = (value: string) => {
    if (!value) return 'Pilih tanggal & jam tayang'
    if (new Date(value) <= new Date()) return 'Jadwal tayang harus di masa depan'
    return null
  }

  const handleSave = () => {
    const error = validate()
    if (error) return toast.error(error)
    update.mutate(payload())
  }

  const handleCreate = () => {
    const error = validate() ?? (mode === 'SCHEDULE' ? validateSchedule(publishAt) : null)
    if (error) return toast.error(error)
    create.mutate(
      {
        ...payload(),
        publishMode: mode,
        ...(mode === 'SCHEDULE' && { publishAt: localInputToIso(publishAt) }),
      },
      { onSuccess: (res) => router.replace(`/newsroom/${(res as { data: { id: string } }).data.id}`) },
    )
  }

  // Simpan dulu kalau ada perubahan, baru jalankan aksi status (publish / jadwal)
  const saveIfDirty = async () => {
    if (!dirty) return true
    const error = validate()
    if (error) {
      toast.error(error)
      return false
    }
    await update.mutateAsync(payload())
    return true
  }

  const slugChanged = isEdit && !!article.publishedAt && form.slug !== article.slug

  return (
    <>
      <NewsroomHeader
        back
        title={isEdit ? 'Edit artikel' : 'Tulis artikel'}
        subtitle={
          isEdit ? (
            <span className="flex flex-wrap items-center gap-2">
              <Chip tone={STATUS_TONE[article.status]}>{STATUS_LABEL[article.status]}</Chip>
              dibuat {article.author.username} · {formatDateTime(article.createdAt)}
            </span>
          ) : (
            'Simpan sebagai draft, langsung tayangkan, atau jadwalkan'
          )
        }
        actions={
          isEdit && (
            <Button disabled={!dirty || update.isPending} onClick={handleSave}>
              {update.isPending && <Loader2 size={14} className="animate-spin" />}
              Simpan perubahan
            </Button>
          )
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ── Kolom kiri: konten ── */}
        <div className="min-w-0 space-y-4">
          <Card className="space-y-4">
            <Field label="Judul">
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={200}
                placeholder="Judul artikel"
                className={`${inputClass} h-14 text-lg`}
              />
            </Field>

            <Field
              label="Slug"
              hint={
                slugChanged
                  ? `URL lama /news/${article?.slug} otomatis di-redirect 301 ke slug baru.`
                  : 'Huruf kecil, angka, dan tanda "-". Kosongkan untuk dibuat dari judul.'
              }
            >
              <div className="flex items-center rounded-2xl border border-[var(--cp-line)] bg-[var(--cp-card)] pl-4 focus-within:border-[var(--cp-accent)]">
                <span className="shrink-0 text-sm text-[var(--cp-muted)]">/news/</span>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  onBlur={() => set('slug', toSlug(form.slug))}
                  maxLength={120}
                  placeholder="judul-artikel"
                  className="h-11 min-w-0 flex-1 bg-transparent pr-4 text-sm outline-none"
                />
              </div>
            </Field>

            <Field label="Ringkasan" hint="Tampil di kartu daftar /news dan jadi fallback meta description.">
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                maxLength={300}
                rows={3}
                placeholder="1–2 kalimat inti artikel"
                className={textareaClass}
              />
            </Field>
          </Card>

          <ContentEditor value={form.content} onChange={(v) => set('content', v)} />
          {children}
        </div>

        {/* ── Kolom kanan: publish, cover, tag, SEO ── */}
        <div className="space-y-4">
          {isEdit ? (
            <StatusCard article={article} dirty={dirty} saveIfDirty={saveIfDirty} />
          ) : (
            <Card className="space-y-4">
              <h2 className="text-sm font-medium">Publikasi</h2>
              <div className="space-y-2">
                {(
                  [
                    ['DRAFT', 'Simpan sebagai draft', 'Belum tampil di publik'],
                    ['PUBLISH', 'Tayangkan sekarang', 'Langsung tampil di /news'],
                    ['SCHEDULE', 'Jadwalkan', 'Tayang otomatis di waktu yang dipilih'],
                  ] as const
                ).map(([value, label, hint]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 transition ${
                      mode === value ? 'border-[var(--cp-accent)]' : 'border-[var(--cp-line)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="publishMode"
                      checked={mode === value}
                      onChange={() => setMode(value)}
                      className="mt-1 accent-[var(--cp-accent)]"
                    />
                    <span>
                      <span className="block text-sm">{label}</span>
                      <span className="block text-xs text-[var(--cp-muted)]">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              {mode === 'SCHEDULE' && (
                <Field label="Waktu tayang" hint="Zona waktu mengikuti perangkat kamu.">
                  <input
                    type="datetime-local"
                    value={publishAt}
                    min={toLocalInput(new Date().toISOString())}
                    onChange={(e) => setPublishAt(e.target.value)}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </Field>
              )}
              <Button className="w-full" disabled={create.isPending} onClick={handleCreate}>
                {create.isPending && <Loader2 size={14} className="animate-spin" />}
                {mode === 'PUBLISH' ? 'Tayangkan' : mode === 'SCHEDULE' ? 'Jadwalkan' : 'Simpan draft'}
              </Button>
            </Card>
          )}

          <CoverCard
            image={form.coverImage}
            alt={form.coverAlt}
            defaultAlt={autoAlt(toSlug(form.slug || form.title)) || 'cover-slug-artikel'}
            onImage={(v) => set('coverImage', v)}
            onAlt={(v) => set('coverAlt', v)}
          />

          <TagsCard tags={form.tags} onChange={(v) => set('tags', v)} />

          <SeoCard form={form} set={set} />
        </div>
      </div>
    </>
  )
}

// ── Isi artikel (markdown) ─────────────────────
function ContentEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(false)
  const upload = useUploadArticleImage()

  // Kembalikan fokus + seleksi setelah value berubah (React memindah kursor ke akhir)
  const select = (start: number, end: number) => {
    const el = ref.current
    requestAnimationFrame(() => {
      el?.focus()
      el?.setSelectionRange(start, end)
    })
  }

  // Bungkus teks terpilih (atau sisipkan placeholder). Dibungkus per baris dan spasi/enter di tepi
  // tetap di luar penanda — markdown tidak mengenali "**teks\n**" (seleksi satu baris penuh ikut enter-nya).
  const wrap = (before: string, after = '', placeholder = '') => {
    const el = ref.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const selected = value.slice(s, e)

    if (!selected.trim()) {
      onChange(value.slice(0, s) + before + placeholder + after + value.slice(e))
      select(s + before.length, s + before.length + placeholder.length)
      return
    }

    const wrapped = selected
      .split('\n')
      .map((line) => {
        const [, lead, text, trail] = line.match(/^(\s*)(.*?)(\s*)$/)!
        return text ? lead + before + text + after + trail : line
      })
      .join('\n')
    onChange(value.slice(0, s) + wrapped + value.slice(e))
    select(s, s + wrapped.length)
  }

  // Prefix di awal setiap baris terpilih (heading, list, quote). Prefix blok lain di baris itu diganti;
  // kalau semua baris sudah ber-prefix yang sama, prefix dilepas (toggle).
  const linePrefix = (prefix: string) => {
    const el = ref.current
    if (!el) return
    const { selectionStart: s, selectionEnd: e } = el
    const start = value.lastIndexOf('\n', s - 1) + 1
    // seleksi yang berakhir tepat setelah enter tidak ikut mengambil baris berikutnya
    const lastIdx = e > s && value[e - 1] === '\n' ? e - 1 : e
    const endIdx = value.indexOf('\n', lastIdx)
    const end = endIdx === -1 ? value.length : endIdx

    const numbered = prefix === '1. '
    const hasPrefix = (l: string) => (numbered ? /^\d+\. /.test(l) : l.startsWith(prefix))
    const lines = value.slice(start, end).split('\n')
    const toggleOff = lines.every((l) => !l.trim() || hasPrefix(l))

    let n = 0
    const next = lines
      .map((l) => {
        if (!l.trim()) return l
        const bare = l.replace(/^(#{1,6} |[-*+] |\d+\. |> )/, '')
        if (toggleOff) return bare
        n += 1
        return (numbered ? `${n}. ` : prefix) + bare
      })
      .join('\n')
    onChange(value.slice(0, start) + next + value.slice(end))
    select(start, start + next.length)
  }

  const insertImage = async (file?: File) => {
    if (!file) return
    const res = await upload.mutateAsync(file).catch(() => null)
    if (res) wrap(`\n![`, `](${res.data.url})\n`, file.name.replace(/\.[^.]+$/, ''))
  }

  const tools = [
    { label: 'Tebal', icon: <Bold size={15} />, run: () => wrap('**', '**', 'teks tebal') },
    { label: 'Miring', icon: <Italic size={15} />, run: () => wrap('_', '_', 'teks miring') },
    { label: 'Subjudul', icon: <Heading2 size={15} />, run: () => linePrefix('## ') },
    { label: 'Sub-subjudul', icon: <Heading3 size={15} />, run: () => linePrefix('### ') },
    { label: 'Link', icon: <Link2 size={15} />, run: () => wrap('[', '](https://)', 'teks link') },
    { label: 'Daftar', icon: <List size={15} />, run: () => linePrefix('- ') },
    { label: 'Daftar bernomor', icon: <ListOrdered size={15} />, run: () => linePrefix('1. ') },
    { label: 'Kutipan', icon: <Quote size={15} />, run: () => linePrefix('> ') },
  ]

  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Isi artikel</h2>
        <div className="flex gap-1 rounded-full bg-[var(--cp-frame)] p-1">
          {(['Tulis', 'Preview'] as const).map((label, i) => (
            <button
              key={label}
              onClick={() => setPreview(i === 1)}
              className={`rounded-full px-4 py-1.5 text-xs ${
                preview === (i === 1) ? 'bg-[var(--cp-accent)] text-[var(--cp-accent-ink)]' : 'text-[var(--cp-muted)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {preview ? (
        <div className="min-h-[420px] rounded-2xl bg-white p-6">
          {value.trim() ? (
            <div className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
          ) : (
            <p className="text-sm text-gray-400">Belum ada isi.</p>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-1">
            {tools.map((t) => (
              <button
                key={t.label}
                type="button"
                title={t.label}
                aria-label={t.label}
                onClick={t.run}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--cp-line)] hover:bg-[var(--cp-card-2)]"
              >
                {t.icon}
              </button>
            ))}
            <button
              type="button"
              title="Sisipkan gambar"
              aria-label="Sisipkan gambar"
              disabled={upload.isPending}
              onClick={() => fileRef.current?.click()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--cp-line)] hover:bg-[var(--cp-card-2)] disabled:opacity-40"
            >
              {upload.isPending ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={(e) => {
                insertImage(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </div>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={'Tulis isi artikel di sini (markdown).\n\n## Subjudul\nParagraf pertama...'}
            className={`${textareaClass} min-h-[420px] font-mono text-[13px] leading-relaxed`}
          />
          <p className="text-[11px] text-[var(--cp-muted)]">
            Format markdown. Judul artikel sudah jadi H1 — mulai subjudul dari <code>##</code>.
          </p>
        </>
      )}
    </Card>
  )
}

// ── Status & aksi (mode edit) ──────────────────
function StatusCard({
  article,
  dirty,
  saveIfDirty,
}: {
  article: ArticleDetail
  dirty: boolean
  saveIfDirty: () => Promise<boolean>
}) {
  const publish = usePublishArticle(article.id)
  const schedule = useScheduleArticle(article.id)
  const unschedule = useUnscheduleArticle(article.id)
  const takedown = useTakedownArticle(article.id)
  const restore = useRestoreArticle(article.id)

  const [scheduleAt, setScheduleAt] = useState(toLocalInput(article.status === 'SCHEDULED' ? article.publishAt : null))
  const [takedownOpen, setTakedownOpen] = useState(false)
  const [reason, setReason] = useState('')

  const busy = publish.isPending || schedule.isPending || unschedule.isPending || takedown.isPending || restore.isPending
  const { status } = article

  // Error sudah di-toast interceptor axios, di sini cukup dihentikan
  const run = async (fn: () => Promise<unknown>) => {
    try {
      if (await saveIfDirty()) await fn()
    } catch {}
  }

  const handleSchedule = () => {
    if (!scheduleAt) return toast.error('Pilih tanggal & jam tayang')
    if (new Date(scheduleAt) <= new Date()) return toast.error('Jadwal tayang harus di masa depan')
    run(() => schedule.mutateAsync(localInputToIso(scheduleAt)))
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Publikasi</h2>
        <Chip tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Chip>
      </div>

      <dl className="space-y-1 text-xs">
        {status === 'SCHEDULED' && <Row label="Jadwal tayang" value={formatDateTime(article.publishAt)} />}
        {status === 'PUBLISHED' && <Row label="Tayang sejak" value={formatDateTime(article.publishAt)} />}
        {article.publishedAt && <Row label="Pertama tayang" value={formatDateTime(article.publishedAt)} />}
        {status === 'TAKEDOWN' && <Row label="Takedown" value={formatDateTime(article.takenDownAt)} />}
        {status === 'TAKEDOWN' && article.takedownReason && <Row label="Alasan" value={article.takedownReason} />}
        <Row label="Terakhir diubah" value={`${formatDateTime(article.updatedAt)} · ${article.editor?.username ?? article.author.username}`} />
      </dl>

      {status === 'PUBLISHED' && (
        <a
          href={`/news/${article.slug}`}
          target="_blank"
          rel="noreferrer"
          className="block truncate text-xs text-[var(--cp-accent)] underline-offset-2 hover:underline"
        >
          /news/{article.slug}
        </a>
      )}

      {dirty && (status === 'DRAFT' || status === 'SCHEDULED') && (
        <p className="text-[11px] text-[var(--cp-muted)]">Perubahan yang belum disimpan ikut disimpan saat publish / jadwal.</p>
      )}

      {(status === 'DRAFT' || status === 'SCHEDULED') && (
        <div className="space-y-3">
          <Button className="w-full" disabled={busy} onClick={() => run(() => publish.mutateAsync(undefined))}>
            Tayangkan sekarang
          </Button>
          <Field label={status === 'SCHEDULED' ? 'Ubah jadwal' : 'Jadwalkan tayang'}>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={scheduleAt}
                min={toLocalInput(new Date().toISOString())}
                onChange={(e) => setScheduleAt(e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
              <Button variant="ghost" disabled={busy} onClick={handleSchedule}>
                {status === 'SCHEDULED' ? 'Ubah' : 'Jadwalkan'}
              </Button>
            </div>
          </Field>
          {status === 'SCHEDULED' && (
            <Button variant="ghost" className="w-full" disabled={busy} onClick={() => unschedule.mutate(undefined)}>
              Batalkan jadwal (jadi draft)
            </Button>
          )}
        </div>
      )}

      {status === 'TAKEDOWN' ? (
        <Button variant="light" className="w-full" disabled={busy} onClick={() => restore.mutate(undefined)}>
          Pulihkan jadi draft
        </Button>
      ) : (
        <Button variant="danger" className="w-full" disabled={busy} onClick={() => setTakedownOpen(true)}>
          Takedown
        </Button>
      )}

      <Modal open={takedownOpen} title="Takedown artikel" onClose={() => setTakedownOpen(false)}>
        <p className="mb-4 text-sm text-[var(--cp-muted)]">
          Artikel langsung hilang dari /news (404) tapi datanya tetap tersimpan dan bisa dipulihkan.
        </p>
        <Field label="Alasan (opsional)">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={300}
            rows={3}
            className={textareaClass}
          />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setTakedownOpen(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            disabled={takedown.isPending}
            onClick={() =>
              takedown.mutate(reason.trim() || undefined, {
                onSuccess: () => {
                  setTakedownOpen(false)
                  setReason('')
                },
              })
            }
          >
            Takedown
          </Button>
        </div>
      </Modal>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-[var(--cp-muted)]">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}

// ── Cover ──────────────────────────────────────
function CoverCard({
  image,
  alt,
  defaultAlt,
  onImage,
  onAlt,
}: {
  image: string
  alt: string
  defaultAlt: string
  onImage: (v: string) => void
  onAlt: (v: string) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const upload = useUploadArticleImage()

  return (
    <Card className="space-y-3">
      <h2 className="text-sm font-medium">Gambar cover</h2>
      {image ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} className="aspect-[16/9] w-full rounded-2xl object-cover" />
          <button
            aria-label="Hapus cover"
            onClick={() => onImage('')}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          disabled={upload.isPending}
          onClick={() => fileRef.current?.click()}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--cp-line)] text-xs text-[var(--cp-muted)] hover:border-[var(--cp-accent)]"
        >
          {upload.isPending ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          Unggah gambar (maks 5MB)
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          const res = file && (await upload.mutateAsync(file).catch(() => null))
          if (res) onImage(res.data.url)
        }}
      />
      <Field
        label="Alt text"
        hint={
          <>
            Deskripsi gambar untuk aksesibilitas & SEO gambar. Kosong = <code>{defaultAlt}</code>.
          </>
        }
      >
        <input
          value={alt}
          onChange={(e) => onAlt(e.target.value)}
          maxLength={200}
          placeholder={defaultAlt}
          className={inputClass}
        />
      </Field>
    </Card>
  )
}

// ── Tag ────────────────────────────────────────
const formatCount = (n: number) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(n)

function TagsCard({ tags, onChange }: { tags: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const { data } = useArticleTags()
  const full = tags.length >= ARTICLE_MAX_TAGS

  const query = draft.trim().toLowerCase()
  const suggestions = useMemo(
    () =>
      (data?.data ?? [])
        .filter((s) => !tags.includes(s.tag) && (!query || s.tag.toLowerCase().includes(query)))
        .slice(0, 8),
    [data, tags, query],
  )
  const isNew = !!query && !tags.includes(query) && !suggestions.some((s) => s.tag.toLowerCase() === query)
  // Baris di dropdown: tag baru (kalau ada) lalu rekomendasi
  const options = [...(isNew ? [query] : []), ...suggestions.map((s) => s.tag)]

  useEffect(() => setActive(0), [query])

  const add = (raw: string) => {
    const tag = raw.trim().toLowerCase()
    setDraft('')
    if (!tag || tags.includes(tag) || full) return
    onChange([...tags, tag])
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Tag</h2>
        <span className="text-[11px] text-[var(--cp-muted)]">
          {tags.length}/{ARTICLE_MAX_TAGS}
        </span>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-full bg-[var(--cp-card-2)] py-1 pl-3 pr-1.5 text-xs">
              {t}
              <button aria-label={`Hapus tag ${t}`} onClick={() => onChange(tags.filter((x) => x !== t))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              setOpen(true)
              if (options.length) setActive((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
            } else if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              add(open && options[active] ? options[active] : draft)
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          onBlur={() => {
            setOpen(false)
            add(draft)
          }}
          maxLength={40}
          placeholder={full ? `Maksimal ${ARTICLE_MAX_TAGS} tag` : 'Ketik tag lalu Enter'}
          disabled={full}
          role="combobox"
          aria-expanded={open && options.length > 0}
          aria-controls="tag-suggestions"
          className={inputClass}
        />
        {open && !full && options.length > 0 && (
          <ul
            id="tag-suggestions"
            role="listbox"
            className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-72 overflow-y-auto rounded-2xl border border-[var(--cp-line)] bg-[var(--cp-card)] p-1.5 shadow-xl"
          >
            {options.map((tag, i) => {
              const s = suggestions.find((x) => x.tag === tag)
              return (
                <li
                  key={tag}
                  role="option"
                  aria-selected={i === active}
                  // mousedown + preventDefault: pilih sebelum input blur
                  onMouseDown={(e) => {
                    e.preventDefault()
                    add(tag)
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-xs ${
                    i === active ? 'bg-[var(--cp-card-2)]' : ''
                  }`}
                >
                  <span className="min-w-0 truncate">
                    {s ? tag : <>Tambah tag baru “{tag}”</>}
                    {s && s.myCount > 0 && (
                      <span className="ml-2 rounded-full bg-[var(--cp-accent)] px-1.5 py-0.5 text-[10px] text-[var(--cp-accent-ink)]">
                        pernah kamu pakai
                      </span>
                    )}
                  </span>
                  {s && (
                    <span className="shrink-0 text-[var(--cp-muted)]">dipakai {formatCount(s.globalCount)}×</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}

// ── SEO ────────────────────────────────────────
function SeoCard({
  form,
  set,
}: {
  form: ArticleFields
  set: <K extends keyof ArticleFields>(key: K, value: ArticleFields[K]) => void
}) {
  const defaultUrl = `${SITE_URL}/news/${form.slug || 'slug-artikel'}`
  const snippetTitle = form.seoTitle || form.title || 'Judul artikel'
  const snippetDesc = form.metaDescription || form.excerpt || markdownToPlain(form.content) || 'Deskripsi artikel…'
  const robotsHint = META_ROBOTS_OPTIONS.find((o) => o.value === form.metaRobots)?.hint

  return (
    <Card className="space-y-4">
      <h2 className="text-sm font-medium">SEO</h2>

      {/* Perkiraan tampilan di hasil Google */}
      <div className="rounded-2xl bg-white p-4 text-left">
        <p className="truncate text-xs text-[#4d5156]">{defaultUrl.replace(/^https?:\/\//, '')}</p>
        <p className="mt-1 line-clamp-1 text-lg leading-snug text-[#1a0dab]">{snippetTitle}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4d5156]">{snippetDesc}</p>
      </div>

      <Field label="SEO title" hint={<Counter value={form.seoTitle} limit={SEO_TITLE_LIMIT} fallback="Kosong = pakai judul artikel" />}>
        <input
          value={form.seoTitle}
          onChange={(e) => set('seoTitle', e.target.value)}
          maxLength={70}
          placeholder={form.title}
          className={inputClass}
        />
      </Field>

      <Field
        label="Meta description"
        hint={<Counter value={form.metaDescription} limit={META_DESCRIPTION_LIMIT} fallback="Kosong = pakai ringkasan" />}
      >
        <textarea
          value={form.metaDescription}
          onChange={(e) => set('metaDescription', e.target.value)}
          maxLength={170}
          rows={3}
          className={textareaClass}
        />
      </Field>

      <Field label="Meta robots" hint={robotsHint}>
        <select
          value={form.metaRobots}
          onChange={(e) => set('metaRobots', e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          {META_ROBOTS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Canonical URL"
        hint={`Kosong = ${defaultUrl}. Isi kalau artikel ini salinan dari halaman lain.`}
      >
        <input
          value={form.canonicalUrl}
          onChange={(e) => set('canonicalUrl', e.target.value)}
          maxLength={500}
          placeholder="https://..."
          className={inputClass}
        />
      </Field>
    </Card>
  )
}

function Counter({ value, limit, fallback }: { value: string; limit: number; fallback: string }) {
  if (!value) return <>{fallback}</>
  const over = value.length > limit
  return (
    <span className={over ? 'text-[var(--cp-danger)]' : undefined}>
      {value.length}/{limit} karakter{over && ' — kemungkinan terpotong di Google'}
    </span>
  )
}
