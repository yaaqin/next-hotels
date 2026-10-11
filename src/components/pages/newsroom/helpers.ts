import { ArticleStatus } from '@/src/models/article'

export const formatDateTime = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

// <input type="datetime-local"> butuh "YYYY-MM-DDTHH:mm" waktu lokal browser
export const toLocalInput = (iso?: string | null) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const localInputToIso = (value: string) => (value ? new Date(value).toISOString() : '')

export const STATUS_TONE: Record<ArticleStatus, 'muted' | 'accent' | 'light' | 'danger'> = {
  DRAFT: 'muted',
  SCHEDULED: 'light',
  PUBLISHED: 'accent',
  TAKEDOWN: 'danger',
}
