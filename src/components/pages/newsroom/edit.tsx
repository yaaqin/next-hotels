'use client'
import { Avatar, Card, Empty, Skeleton } from '@/src/components/organisms/configPanel/ui'
import { ACTION_LABEL, FIELD_LABEL, STATUS_LABEL } from '@/src/constans/newsroom'
import { useArticle } from '@/src/hooks/query/article'
import { ArticleChange, ArticleRevision, ArticleStatus } from '@/src/models/article'
import { Bot } from 'lucide-react'
import ArticleEditor from './editor'
import { formatDateTime } from './helpers'

export default function ArticleEditPage({ id }: { id: string }) {
  const { data, isLoading, error } = useArticle(id)
  const article = data?.data

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-[480px] w-full" />
      </div>
    )
  }
  if (error || !article) return <Empty dark>Artikel tidak ditemukan.</Empty>

  // key: form di-reset dari data server setiap kali artikel tersimpan
  return (
    <ArticleEditor key={article.updatedAt} article={article}>
      <HistoryCard revisions={article.revisions} />
    </ArticleEditor>
  )
}

// ── Riwayat perubahan ──────────────────────────
function HistoryCard({ revisions }: { revisions: ArticleRevision[] }) {
  return (
    <Card>
      <h2 className="mb-4 text-sm font-medium">Riwayat</h2>
      {revisions.length === 0 ? (
        <Empty dark>Belum ada riwayat.</Empty>
      ) : (
        <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[17px] before:top-2 before:w-px before:bg-[var(--cp-line)]">
          {revisions.map((r) => (
            <li key={r.id} className="relative flex gap-3">
              {r.admin ? (
                <Avatar name={r.admin.username} size={36} />
              ) : (
                <span className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--cp-card-2)] ring-2 ring-[var(--cp-card)]">
                  <Bot size={16} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{r.admin?.username ?? 'Sistem'}</span>{' '}
                  <span className="text-[var(--cp-muted)]">{(ACTION_LABEL[r.action] ?? r.action).toLowerCase()}</span>
                </p>
                <p className="text-[11px] text-[var(--cp-muted)]">{formatDateTime(r.createdAt)}</p>
                {r.changes.length > 0 && (
                  <ul className="mt-2 space-y-1 rounded-2xl bg-[var(--cp-frame)] p-3 text-xs">
                    {r.changes.map((c, i) => (
                      <ChangeLine key={i} change={c} />
                    ))}
                  </ul>
                )}
                {r.note && <p className="mt-2 text-xs text-[var(--cp-muted)]">Alasan: {r.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}

function ChangeLine({ change }: { change: ArticleChange }) {
  const label = FIELD_LABEL[change.field] ?? change.field
  // Isi artikel tidak disimpan di riwayat, cuma ditandai berubah
  if (!('from' in change) && !('to' in change)) {
    return (
      <li>
        <span className="text-[var(--cp-muted)]">{label}</span> diubah
      </li>
    )
  }
  return (
    <li className="break-words">
      <span className="text-[var(--cp-muted)]">{label}:</span>{' '}
      <span className="line-through opacity-60">{show(change.field, change.from)}</span> →{' '}
      <span>{show(change.field, change.to)}</span>
    </li>
  )
}

const show = (field: string, v: unknown): string => {
  if (v === null || v === undefined || v === '') return '(kosong)'
  if (field === 'status') return STATUS_LABEL[v as ArticleStatus] ?? String(v)
  if (field === 'publishAt') return formatDateTime(String(v))
  if (Array.isArray(v)) return v.length ? v.join(', ') : '(kosong)'
  const s = String(v)
  return s.length > 80 ? `${s.slice(0, 79)}…` : s
}
