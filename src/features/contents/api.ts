import type { ContentType, PublicContent, Page, SiteSettings } from './types'

import { publicApi } from '@/shared/api/publicApi'

export async function contents(
  options: {
    page?: number
    pageSize?: number
    type?: ContentType
    category?: string
    tag?: string
    sort?: string
  } = {},
): Promise<Page<PublicContent>> {
  const query = new URLSearchParams({
    page: String(options.page ?? 1),
    pageSize: String(options.pageSize ?? 12),
  })
  if (options.type) query.set('type', options.type)
  if (options.category) query.set('category', options.category)
  if (options.tag) query.set('tag', options.tag)
  if (options.sort) query.set('sort', options.sort)
  const result = await publicApi<Page<PublicContent>>(`contents?${query}`)
  if (!result) throw new Error('Content API unavailable')
  return result
}

export async function content(type: ContentType, slug: string): Promise<PublicContent | null> {
  return publicApi<PublicContent>(`contents/${type}/${encodeURIComponent(slug)}`)
}

export async function siteSettings(): Promise<SiteSettings> {
  const result = await publicApi<SiteSettings>('settings')
  if (!result) throw new Error('Site settings unavailable')
  return result
}

export async function names(kind: 'categories' | 'tags'): Promise<string[]> {
  const result = await publicApi<{ name: string }[]>(kind)
  if (!result) throw new Error('Taxonomy unavailable')
  return result.map((item) => item.name)
}

export function contentPath(item: Pick<PublicContent, 'type' | 'slug'>): string {
  const prefix = { ARTICLE: '/writing', POST: '/posts' }[item.type]
  return `${prefix}/${encodeURIComponent(item.slug)}`
}

export const typeNames: Record<ContentType, string> = { ARTICLE: '文章', POST: '帖子' }

export function firstSentence(markdown: string | null): string {
  const text =
    (markdown ?? '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_`~-]/g, '')
      .split(/\n|。|！|？/)
      .map((part) => part.trim())
      .find(Boolean) ?? ''
  return text.slice(0, 120)
}
