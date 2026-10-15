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
