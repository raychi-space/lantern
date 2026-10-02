import type { PublicArticle, Page } from './types'

const apiUrl = process.env.RAYCHI_API_URL ?? 'http://127.0.0.1:8080'

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return (await response.json()) as T
}

export async function articles(page = 1): Promise<Page<PublicArticle>> {
  return get(`/api/v1/public/articles?page=${page}&pageSize=12`)
}

export async function article(slug: string): Promise<PublicArticle | null> {
  const response = await fetch(`${apiUrl}/api/v1/public/articles/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return (await response.json()) as PublicArticle
}
