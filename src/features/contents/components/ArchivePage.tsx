import Link from 'next/link'
import { contentPath, contents, firstSentence } from '../api'
import type { ContentType, PublicContent } from '../types'
import { PageTransition } from '@/shared/ui/PageTransition'
import { ChipLink } from '@/shared/ui/Chip'

type Params = { postsSort?: string; articlesSort?: string }

const sortOptions = [
  { id: 'latest', label: '最新优先' },
  { id: 'oldest', label: '最早优先' },
  { id: 'title', label: '按标题' },
] as const
type SortId = typeof sortOptions[number]['id']
const sortId = (value?: string): SortId => value === 'oldest' || value === 'title' ? value : 'latest'
const archivePageSize = 50

const date = (value: string) => new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date(value))

const titleOf = (item: PublicContent) => item.title || firstSentence(item.bodyMarkdown)

const sorters: Record<SortId, (a: PublicContent, b: PublicContent) => number> = {
  latest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  oldest: (a, b) => a.publishedAt.localeCompare(b.publishedAt),
  title: (a, b) => titleOf(a).localeCompare(titleOf(b), 'zh-Hans-CN'),
}

async function allContents(type: ContentType): Promise<PublicContent[]> {
  const first = await contents({ type, page: 1, pageSize: archivePageSize })
  const items = [...first.items]
  const pages = Math.ceil(first.total / first.pageSize)
  for (let page = 2; page <= pages; page++) {
    items.push(...(await contents({ type, page, pageSize: archivePageSize })).items)
  }
  return items
}

function ArchiveRows({ items, compact = false }: { items: PublicContent[]; compact?: boolean }) {
  if (!items.length) return <p className="archive-empty">这里还没有已发布内容。</p>
  return <div className={compact ? 'archive-list archive-list-compact' : 'archive-list'}>{items.map(item =>
    <Link className="archive-entry" href={contentPath(item)} key={item.id} transitionTypes={['nav-forward']}>
      <time dateTime={item.publishedAt}>{date(item.publishedAt)}</time>
      <span className="archive-entry-copy"><strong>{item.title || firstSentence(item.bodyMarkdown)}</strong>
        {!compact && <small>{item.summary || firstSentence(item.bodyMarkdown)}</small>}
        {compact && item.title && <small>{firstSentence(item.bodyMarkdown)}</small>}</span>
      <span className="archive-entry-arrow" aria-hidden="true">↗</span>
    </Link>)}</div>
}

export async function ArchivePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const articlesSort = sortId(params.articlesSort)
  const postsSort = sortId(params.postsSort)
  const [articles, posts] = await Promise.all([allContents('ARTICLE'), allContents('POST')])
  const sortLink = (kind: 'articles' | 'posts', next: SortId) => {
    const query = new URLSearchParams()
    query.set('articlesSort', kind === 'articles' ? next : articlesSort)
    query.set('postsSort', kind === 'posts' ? next : postsSort)
    return `/archive?${query}`
  }
  return <PageTransition><main className="inner-page archive-page">
    <header className="page-intro"><p className="eyebrow">ARCHIVE</p><h1>回顾</h1>
      <p>按公开时间，翻阅已经写下的内容。</p></header>
    <div className="archive-columns">
      <section className="archive-col" id="articles" aria-labelledby="archive-articles-title">
        <div className="archive-col-head"><h2 id="archive-articles-title">文章</h2><span>{articles.length}</span></div>
        <nav className="archive-sort" aria-label="文章排序方式">{sortOptions.map(option =>
          <ChipLink key={option.id} href={sortLink('articles', option.id)}
            active={articlesSort === option.id}>{option.label}</ChipLink>)}</nav>
        <ArchiveRows items={[...articles].sort(sorters[articlesSort])} />
      </section>
      <section className="archive-col archive-col-posts" id="posts" aria-labelledby="archive-posts-title">
        <div className="archive-col-head"><h2 id="archive-posts-title">帖子</h2><span>{posts.length}</span></div>
        <nav className="archive-sort" aria-label="帖子排序方式">{sortOptions.map(option =>
          <ChipLink key={option.id} href={sortLink('posts', option.id)}
            active={postsSort === option.id}>{option.label}</ChipLink>)}</nav>
        <ArchiveRows items={[...posts].sort(sorters[postsSort])} compact />
      </section>
    </div>
  </main></PageTransition>
}
