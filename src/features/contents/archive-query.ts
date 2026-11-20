export type ArticleFilters = {
  articlesCategory?: string
  articlesTag?: string
}

export type ArchiveQuery = ArticleFilters & {
  articlesSort?: string
  postsSort?: string
  articlesPage?: number
  postsPage?: number
}

export function filterValue(value?: string | string[]): string | undefined {
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined
}

export function archiveHref(filters: ArchiveQuery): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) query.set(key, String(value))
  }
  return query.size ? `/archive?${query}` : '/archive'
}
