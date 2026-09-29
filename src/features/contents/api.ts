export type ContentType = 'ARTICLE' | 'POST'
export type PublicContent = {
  id: string
  slug: string
  type: ContentType
  title: string
  summary: string
  bodyMarkdown: string | null
  tags: string[]
  coverUrl: string | null
  category: string | null
  publishedAt: string
  publicUpdatedAt: string
}
export type Page<T> = { items: T[]; page: number; pageSize: number; total: number }
export type SiteLink = { label: string; href: string }
export type HomepageProject = { name: string; description: string; status: string; href: string }
export type HomepageSection = { id: 'featured' | 'posts' | 'writing' | 'projects' | 'stats'; visible: boolean }
export type HomepageSettings = {
  focus: string
  projects: HomepageProject[]
  recentSections: HomepageSection[]
  bottomSections: HomepageSection[]
}
export type SiteSettings = {
  version: number
  siteName: string
  intro: string
  avatarUrl: string | null
  contacts: SiteLink[]
  accounts: SiteLink[]
  navigation: SiteLink[]
  homeSections: { id: 'feed' | 'writing' | 'posts' | 'thoughts'; visible: boolean }[]
  homepage?: HomepageSettings
}

const base = process.env.RAYCHI_API_URL ?? 'http://127.0.0.1:8080'

export async function contents(options: { page?: number; pageSize?: number; type?: ContentType; category?: string; tag?: string } = {}): Promise<Page<PublicContent>> {
  const query = new URLSearchParams({ page: String(options.page ?? 1), pageSize: String(options.pageSize ?? 12) })
  if (options.type) query.set('type', options.type)
  if (options.category) query.set('category', options.category)
  if (options.tag) query.set('tag', options.tag)
  const response = await fetch(`${base}/api/v1/public/contents?${query}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return response.json() as Promise<Page<PublicContent>>
}

export async function content(type: ContentType, slug: string): Promise<PublicContent | null> {
  const response = await fetch(`${base}/api/v1/public/contents/${type}/${encodeURIComponent(slug)}`, { cache: 'no-store' })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return response.json() as Promise<PublicContent>
}

export async function siteSettings(): Promise<SiteSettings> {
  const response = await fetch(`${base}/api/v1/public/settings`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return response.json() as Promise<SiteSettings>
}

export async function names(kind: 'categories' | 'tags'): Promise<string[]> {
  const response = await fetch(`${base}/api/v1/public/${kind}`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Content API returned ${response.status}`)
  return ((await response.json()) as { name: string }[]).map(item => item.name)
}

export function contentPath(item: Pick<PublicContent, 'type' | 'slug'>): string {
  const prefix = { ARTICLE: '/writing', POST: '/posts' }[item.type]
  return `${prefix}/${encodeURIComponent(item.slug)}`
}

export const typeNames: Record<ContentType, string> = { ARTICLE: '文章', POST: '帖子' }

export function firstSentence(markdown: string | null): string {
  const text = (markdown ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`~-]/g, '')
    .split(/\n|。|！|？/).map(part => part.trim()).find(Boolean) ?? ''
  return text.slice(0, 120)
}
