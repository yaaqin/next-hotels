import { ArticleStatus } from '@/src/models/article'

// Harus sama dengan ARTICLE_ROLES di BE (nest-hotels/src/article/article.constants.ts)
export const ARTICLE_ADMIN_ROLE = 'ARTICLE_ADMIN'
export const NEWSROOM_ROLES = ['DEV', 'SUPERADMIN', ARTICLE_ADMIN_ROLE]

export const canAccessNewsroom = (roleName?: string | null) =>
  !!roleName && NEWSROOM_ROLES.includes(roleName)

// Harus sama dengan ARTICLE_MAX_TAGS di BE
export const ARTICLE_MAX_TAGS = 5

export const META_ROBOTS_OPTIONS = [
  { value: 'index,follow', label: 'index, follow', hint: 'Default — muncul di Google, link diikuti' },
  { value: 'noindex,follow', label: 'noindex, follow', hint: 'Tidak muncul di Google, link tetap diikuti' },
  { value: 'index,nofollow', label: 'index, nofollow', hint: 'Muncul di Google, link tidak diikuti' },
  { value: 'noindex,nofollow', label: 'noindex, nofollow', hint: 'Disembunyikan total dari mesin pencari' },
]

export const STATUS_LABEL: Record<ArticleStatus, string> = {
  DRAFT: 'Draft',
  SCHEDULED: 'Terjadwal',
  PUBLISHED: 'Tayang',
  TAKEDOWN: 'Takedown',
}

export const ACTION_LABEL: Record<string, string> = {
  CREATE: 'Membuat artikel',
  UPDATE: 'Mengedit',
  PUBLISH: 'Menayangkan',
  SCHEDULE: 'Menjadwalkan',
  UNSCHEDULE: 'Membatalkan jadwal',
  AUTO_PUBLISH: 'Tayang otomatis (jadwal)',
  TAKEDOWN: 'Takedown',
  RESTORE: 'Memulihkan jadi draft',
}

export const FIELD_LABEL: Record<string, string> = {
  title: 'Judul',
  slug: 'Slug',
  excerpt: 'Ringkasan',
  content: 'Isi artikel',
  coverImage: 'Gambar cover',
  coverAlt: 'Alt cover',
  tags: 'Tag',
  seoTitle: 'SEO title',
  metaDescription: 'Meta description',
  metaRobots: 'Meta robots',
  canonicalUrl: 'Canonical URL',
  status: 'Status',
  publishAt: 'Jadwal tayang',
}

// Batas aman tampilan snippet Google (BE membatasi 70 / 170)
export const SEO_TITLE_LIMIT = 60
export const META_DESCRIPTION_LIMIT = 160
