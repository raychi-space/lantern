import Link from 'next/link'
import { contentPath, contents, firstSentence, type PublicContent } from '@/features/contents/api'

type Params = { postsPage?: string; articlesPage?: string }

const pageNumber = (value?: string) => {
  const parsed = Number(value ?? '1')
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}
const date = (value: string) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(value))

function ArchiveRows({ items, compact = false }: { items: PublicContent[]; compact?: boolean }) {
  if (!items.length) return <p className="archive-empty">这里还没有已发布内容。</p>
  return <div className={compact ? 'archive-list archive-list-compact' : 'archive-list'}>{items.map(item =>
    <Link className="archive-entry" href={contentPath(item)} key={item.id}>
      <time dateTime={item.publishedAt}>{date(item.publishedAt)}</time>
      <span className="archive-entry-copy"><strong>{item.title || firstSentence(item.bodyMarkdown)}</strong>
        {!compact && <small>{item.summary || firstSentence(item.bodyMarkdown)}</small>}
        {compact && item.title && <small>{firstSentence(item.bodyMarkdown)}</small>}</span>
      <span className="archive-entry-arrow" aria-hidden="true">↗</span>
    </Link>)}</div>
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const postsPage = pageNumber(params.postsPage)
  const articlesPage = pageNumber(params.articlesPage)
  const [posts, articles] = await Promise.all([
    contents({ type: 'POST', page: postsPage, pageSize: 8 }),
    contents({ type: 'ARTICLE', page: articlesPage, pageSize: 8 }),
  ])
  const pageLink = (kind: 'posts' | 'articles', next: number) => {
    const query = new URLSearchParams()
    query.set('postsPage', String(kind === 'posts' ? next : postsPage))
    query.set('articlesPage', String(kind === 'articles' ? next : articlesPage))
    return `/archive?${query}#${kind}`
  }
  return <main className="inner-page archive-page">
    <div className="page-intro"><p className="eyebrow">ARCHIVE</p><h1>回顾</h1>
      <p>按公开时间，翻阅已经写下的内容。</p></div>
    <section className="archive-section" id="posts" aria-labelledby="archive-posts-title">
      <div className="archive-section-heading"><h2 id="archive-posts-title">帖子</h2><span>{posts.total}</span></div>
      <ArchiveRows items={posts.items} compact />
      <div className="pagination">{postsPage > 1 && <Link href={pageLink('posts', postsPage - 1)}>← 上一页</Link>}
        {postsPage * posts.pageSize < posts.total && <Link href={pageLink('posts', postsPage + 1)}>下一页 →</Link>}</div>
    </section>
    <section className="archive-section" id="articles" aria-labelledby="archive-articles-title">
      <div className="archive-section-heading"><h2 id="archive-articles-title">文章</h2><span>{articles.total}</span></div>
      <ArchiveRows items={articles.items} />
      <div className="pagination">{articlesPage > 1 && <Link href={pageLink('articles', articlesPage - 1)}>← 上一页</Link>}
        {articlesPage * articles.pageSize < articles.total && <Link href={pageLink('articles', articlesPage + 1)}>下一页 →</Link>}</div>
    </section>
  </main>
}
