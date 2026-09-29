export type PublicArticle = {
  id: string
  slug: string
  title: string
  summary: string
  bodyMarkdown: string | null
  tags: string[]
  coverUrl: string | null
  publishedAt: string
  publicUpdatedAt: string
}

export type Page<T> = { items: T[]; page: number; pageSize: number; total: number }
