export type ArticleStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'TAKEDOWN'
export type PublishMode = 'DRAFT' | 'PUBLISH' | 'SCHEDULE'

export interface AdminRef {
  id: string
  username: string
}

export interface ArticleFields {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  tags: string[]
  seoTitle: string
  metaDescription: string
  metaRobots: string
  canonicalUrl: string
}

// GET /articles/tags — urut: pernah dipakai admin ini dulu, lalu paling sering dipakai
export interface ArticleTagSuggestion {
  tag: string
  globalCount: number
  myCount: number
}

export interface ArticleListItem {
  id: string
  title: string
  slug: string
  coverImage: string | null
  status: ArticleStatus
  publishAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: AdminRef
  editor: AdminRef | null
}

export interface ArticleList {
  items: ArticleListItem[]
  counts: Record<ArticleStatus, number>
  meta: { page: number; pageSize: number; total: number }
}

export interface ArticleChange {
  field: string
  from?: unknown
  to?: unknown
}

export interface ArticleRevision {
  id: string
  action: string
  changes: ArticleChange[]
  note: string | null
  createdAt: string
  admin: AdminRef | null
}

export interface ArticleDetail extends ArticleListItem {
  oldSlugs: string[]
  excerpt: string | null
  content: string
  coverAlt: string | null
  tags: string[]
  takenDownAt: string | null
  takedownReason: string | null
  seoTitle: string | null
  metaDescription: string | null
  metaRobots: string
  canonicalUrl: string | null
  revisions: ArticleRevision[]
}

export type CreateArticlePayload = Partial<ArticleFields> &
  Pick<ArticleFields, 'title' | 'content'> & { publishMode: PublishMode; publishAt?: string }

export type UpdateArticlePayload = Partial<ArticleFields>

// ── Publik (/news) ─────────────────────────────
export interface PublicArticleItem {
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  coverAlt: string | null
  tags: string[]
  publishAt: string | null
  publishedAt: string | null
  updatedAt: string
  viewCount: number
  likeCount: number
}

export interface PublicArticle extends PublicArticleItem {
  content: string
  seoTitle: string | null
  metaDescription: string | null
  metaRobots: string
  canonicalUrl: string | null
}

// Kartu di bawah artikel /news/[slug] (GET /public/news/:slug/related), masing-masing maks 5
export interface PublicArticleRelated {
  latest: PublicArticleItem[]
  similar: PublicArticleItem[]
  alsoLiked: PublicArticleItem[]
  others: PublicArticleItem[]
}

export interface PublicArticleList {
  items: PublicArticleItem[]
  meta: { page: number; pageSize: number; total: number }
}

export type PublicArticleResolved =
  | { redirect: string; article: null }
  | { redirect: null; article: PublicArticle }

export interface PublicArticleSitemapItem {
  slug: string
  updatedAt: string
  metaRobots: string
  canonicalUrl: string | null
}

// ── Laporan /newsroom/report (GET /articles/analytics) ──
export type AnalyticsRange = '24h' | '7d' | '30d' | '90d'

export interface AnalyticsArticle {
  slug: string
  title: string
  tags: string[]
  publishedAt: string | null
  views: number
  viewsPrev: number
  likes: number
  likesPrev: number
  first6h: number
  first24h: number
}

export interface AnalyticsSpike {
  slug: string
  title: string
  tags: string[]
  day: string // YYYY-MM-DD (WIB)
  views: number
  baseline: number // rata-rata view harian 7 hari sebelumnya
  ratio: number
  // Artikel lain dengan tag yang sama di hari lonjakan; ratio null = tidak punya baseline
  halo: { tag: string; articles: number; views: number; baseline: number; ratio: number | null; lifted: boolean }[]
}

export interface AnalyticsTagStat {
  articles: number
  views: number
  viewsPrev: number
  likes: number
  avgViews: number
  avgFirst24h: number | null
}

export interface ArticleAnalytics {
  range: AnalyticsRange
  bucket: 'hour' | 'day'
  from: string
  to: string
  prevFrom: string
  trackingStart: string | null
  summary: {
    views: number
    viewsPrev: number
    likes: number
    likesPrev: number
    viewedArticles: number
    totalArticles: number
    published: number
  }
  timeline: { t: string; views: number; likes: number }[]
  topViews: AnalyticsArticle[]
  risers: AnalyticsArticle[]
  topLikes: AnalyticsArticle[]
  fastStarts: (AnalyticsArticle & { running: boolean })[]
  spikes: AnalyticsSpike[]
  tags: (AnalyticsTagStat & { tag: string })[]
  tagPairs: (AnalyticsTagStat & { tags: string[] })[]
}
