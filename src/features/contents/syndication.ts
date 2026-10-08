import { contents, contentPath, firstSentence, siteSettings } from './api'
import type { PublicContent } from './types'
import { siteUrl } from '@/shared/seo/site-url'
import { xml } from '@/shared/seo/xml'

export const sitemapPageSize = 50
const staticPages = ['/', '/writing', '/posts', '/archive', '/more']

export async function sitemapIndex(): Promise<string> {
  const result = await contents({ pageSize: sitemapPageSize })
  const count = Math.ceil(result.total / sitemapPageSize)
  if (!Number.isSafeInteger(count) || count < 0 || count > 49999) {
    throw new Error('Sitemap index exceeds supported size')
  }
  const paths = [
    '/sitemap-pages.xml',
    ...Array.from({ length: count }, (_, i) => `/sitemap-${i + 1}.xml`),
  ]
  return `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
    .map((path) => `<sitemap><loc>${xml(siteUrl(path))}</loc></sitemap>`)
    .join('')}</sitemapindex>`
}

export async function sitemapPage(name: string): Promise<string | null> {
  let urls: { url: string; modified?: string }[]
  if (name === 'pages.xml') {
    urls = staticPages.map((path) => ({ url: siteUrl(path) }))
  } else {
    if (!/^[1-9]\d{0,4}\.xml$/.test(name)) return null
    const page = Number(name.slice(0, -4))
    if (page > 49999) return null
    const result = await contents({ page, pageSize: sitemapPageSize })
    if (!result.items.length) return null
    urls = result.items.map((item) => ({
      url: siteUrl(contentPath(item)),
      modified: item.publicUpdatedAt,
    }))
  }
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map(
      ({ url, modified }) =>
        `<url><loc>${xml(url)}</loc>${modified ? `<lastmod>${xml(modified)}</lastmod>` : ''}</url>`,
    )
    .join('')}</urlset>`
}

function rssItem(item: PublicContent): string {
  const link = siteUrl(contentPath(item))
  const title = item.title || firstSentence(item.bodyMarkdown) || '帖子'
  const description = item.summary || firstSentence(item.bodyMarkdown) || title
  // RSS descriptions contain entity-encoded HTML: escape text before the XML layer.
  const html = `<p>${xml(description)}</p>`
  return `<item><title>${xml(title)}</title><link>${xml(link)}</link><guid isPermaLink="true">${xml(link)}</guid><pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate><description>${xml(html)}</description>${item.tags
    .map((tag) => `<category>${xml(tag)}</category>`)
    .join('')}</item>`
}

export async function rssFeed(): Promise<string> {
  const [settings, result] = await Promise.all([siteSettings(), contents({ pageSize: 50 })])
  const updated = result.items.reduce(
    (latest, item) => Math.max(latest, Date.parse(item.publicUpdatedAt)),
    0,
  )
  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(settings.siteName)}</title><link>${xml(siteUrl('/'))}</link><description>${xml(settings.intro || settings.siteName)}</description><language>zh-CN</language><atom:link href="${xml(siteUrl('/feed.xml'))}" rel="self" type="application/rss+xml"/>${updated ? `<lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>` : ''}${result.items.map(rssItem).join('')}</channel></rss>`
}
