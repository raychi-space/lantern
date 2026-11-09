export type ReadingArticle = {
  id: string
  url: string
  originalTitle: string
  translatedTitle?: string | null
  publishedAt: string
  illustrationSeed: string
}

export type ReadingSource = {
  id: string
  name: string
  description: string
  siteUrl: string
  articles: ReadingArticle[]
}

export type ReadingShelf = { displayDays: number; sources: ReadingSource[] }

export type DiscoveryEntry = {
  id: string
  title: string
  summary: string | null
  publishedAt: string | null
  sourceCount: number
  sources: { name: string | null; title: string; url: string }[]
}
export type DiscoveryPage = {
  mode: 'legacy' | 'aihot'
  view: 'hot' | 'latest' | 'reports'
  period: 'daily' | 'weekly' | 'monthly'
  key: string
  available: boolean
  stale: boolean
  updatedAt: string | null
  items: DiscoveryEntry[]
  nextCursor: string | null
  issues: { key: string; generatedAt: string | null }[]
  report: {
    key: string
    title: string | null
    intro: string | null
    generatedAt: string | null
    sections: { label: string; summary?: string | null; items: DiscoveryEntry[] }[]
  } | null
}
