import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { content, contentPath, firstSentence, siteSettings } from './api'
import type { ContentType, SiteSettings } from './types'
import { publicImageUrl, siteUrl } from '@/shared/seo/site-url'

function metadata(
  settings: SiteSettings,
  title: string | undefined,
  path: string,
  description: string,
  index: boolean,
): Metadata {
  const fullTitle = title ? `${title} · ${settings.siteName}` : `${settings.siteName} · 个人空间`
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: siteUrl(path),
      types: { 'application/rss+xml': siteUrl('/feed.xml') },
    },
    robots: { index, follow: true },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      siteName: settings.siteName,
      title: fullTitle,
      description,
      url: siteUrl(path),
    },
    twitter: { card: 'summary', title: fullTitle, description },
  }
}

export async function pageMetadata(
  title: string | undefined,
  path: string,
  description?: string,
  index = true,
): Promise<Metadata> {
  const settings = await siteSettings()
  return metadata(settings, title, path, description ?? settings.intro, index)
}

export async function contentMetadata(type: ContentType, slug: string): Promise<Metadata> {
  const [item, settings] = await Promise.all([content(type, slug), siteSettings()])
  if (!item) notFound()
  const title = item.title || firstSentence(item.bodyMarkdown) || '帖子'
  const description = item.summary || firstSentence(item.bodyMarkdown) || title
  const result = metadata(settings, title, contentPath(item), description, true)
  const image = publicImageUrl(item.coverUrl)
  return {
    ...result,
    openGraph: {
      ...result.openGraph,
      type: 'article',
      publishedTime: item.publishedAt,
      modifiedTime: item.publicUpdatedAt,
      tags: item.tags,
      section: item.category ?? undefined,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      ...result.twitter,
      card: image ? 'summary_large_image' : 'summary',
      images: image ? [image] : undefined,
    },
  }
}

export async function listMetadata(
  type: ContentType,
  params: { page?: string; category?: string; tag?: string },
): Promise<Metadata> {
  const page = Number(params.page ?? '1')
  const query = new URLSearchParams()
  if (Number.isInteger(page) && page > 1) query.set('page', String(page))
  if (type === 'ARTICLE' && params.category) query.set('category', params.category)
  if (params.tag) query.set('tag', params.tag)
  const path = type === 'ARTICLE' ? '/writing' : '/posts'
  return pageMetadata(
    `${type === 'ARTICLE' ? '文章' : '帖子'}${query.has('page') ? ` · 第 ${page} 页` : ''}`,
    `${path}${query.size ? `?${query}` : ''}`,
    type === 'ARTICLE' ? '值得慢慢说的事情，写得完整一些。' : '按时间写下的短记录。',
    !query.has('category') && !query.has('tag'),
  )
}
