import type { SiteLink } from '@/shared/types/navigation'

export type { SiteLink } from '@/shared/types/navigation'

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
export type SocialAccount = { platform: string; enabled: boolean; href: string }
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
  socialAccounts: SocialAccount[]
  projectIntro: string
  navigation: SiteLink[]
  homeSections: { id: 'feed' | 'writing' | 'posts' | 'thoughts'; visible: boolean }[]
  homepage: HomepageSettings
}
