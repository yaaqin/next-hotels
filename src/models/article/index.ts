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
}

export interface PublicArticle extends PublicArticleItem {
  content: string
  seoTitle: string | null
  metaDescription: string | null
  metaRobots: string
  canonicalUrl: string | null
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
