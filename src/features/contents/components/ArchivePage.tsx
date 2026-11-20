import Link from 'next/link'
import { contentPath, contents, firstSentence, names } from '../api'
import { archiveHref, filterValue } from '../archive-query'
import type { PublicContent } from '../types'
import { ArchiveFilters } from './ArchiveFilters'
import { PageTransition } from '@/shared/ui/PageTransition'
import { PageIntro } from '@/shared/ui/PageIntro'
import { Pagination } from '@/shared/ui/Pagination'
import { ChipLink } from '@/shared/ui/Chip'
import { EmptyState } from '@/shared/ui/EmptyState'

type Params = {
  postsSort?: string
  articlesSort?: string
  postsPage?: string
  articlesPage?: string
  articlesCategory?: string | string[]
  articlesTag?: string | string[]
}

const sortOptions = [
  { id: 'latest', label: '最新优先' },
  { id: 'oldest', label: '最早优先' },
  { id: 'title', label: '按标题' },
] as const
type SortId = (typeof sortOptions)[number]['id']
const sortId = (value?: string): SortId =>
  value === 'oldest' || value === 'title' ? value : 'latest'
const archivePageSize = 50

const date = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))

const pageOf = (value?: string) =>
  /^\d+$/.test(value ?? '') && Number(value) > 0 && Number(value) <= 1000000 ? Number(value) : 1

function ArchiveRows({
  items,
  compact = false,
  filtered = false,
}: {
  items: PublicContent[]
  compact?: boolean
  filtered?: boolean
}) {
  if (!items.length) {
    return (
      <EmptyState inline>
        {filtered ? '没有符合筛选条件的文章。' : '这里还没有已发布内容。'}
      </EmptyState>
    )
  }
  return (
    <div className={compact ? 'archive-list archive-list-compact' : 'archive-list'}>
      {items.map((item) => (
        <Link
          className="archive-entry"
          href={contentPath(item)}
          key={item.id}
          prefetch={false}
          transitionTypes={['nav-forward']}
        >
          <time dateTime={item.publishedAt}>{date(item.publishedAt)}</time>
          <span className="archive-entry-copy">
            <strong>{item.title || firstSentence(item.bodyMarkdown)}</strong>
            {!compact && <small>{item.summary || firstSentence(item.bodyMarkdown)}</small>}
            {compact && item.title && <small>{firstSentence(item.bodyMarkdown)}</small>}
          </span>
        </Link>
      ))}
    </div>
  )
}

export async function ArchivePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const articlesSort = sortId(params.articlesSort)
  const postsSort = sortId(params.postsSort)
  const articlesPage = pageOf(params.articlesPage)
  const postsPage = pageOf(params.postsPage)
  const articlesCategory = filterValue(params.articlesCategory)
  const articlesTag = filterValue(params.articlesTag)
  const query = { articlesSort, postsSort, articlesPage, postsPage, articlesCategory, articlesTag }
  const [articles, posts, categories, tags] = await Promise.all([
    contents({
      type: 'ARTICLE',
      page: articlesPage,
      pageSize: archivePageSize,
      sort: articlesSort,
      category: articlesCategory,
      tag: articlesTag,
    }),
    contents({ type: 'POST', page: postsPage, pageSize: archivePageSize, sort: postsSort }),
    names('categories').catch(() => null),
    names('tags').catch(() => null),
  ])
  const sortLink = (kind: 'articles' | 'posts', next: SortId) =>
    archiveHref({ ...query, [`${kind}Sort`]: next, [`${kind}Page`]: 1 })
  const pageLink = (kind: 'articles' | 'posts', page: number) =>
    archiveHref({ ...query, [`${kind}Page`]: page })
  return (
    <PageTransition>
      <main className="inner-page archive-page">
        <PageIntro kicker="ARCHIVE" title="回顾" />
        <div className="archive-columns">
          <section className="archive-col" id="articles" aria-labelledby="archive-articles-title">
            <div className="archive-col-head">
              <h2 id="archive-articles-title">文章</h2>
              <span>{articles.total}</span>
            </div>
            <nav className="archive-sort archive-article-controls" aria-label="文章排序和筛选">
              {sortOptions.map((option) => (
                <ChipLink
                  key={option.id}
                  href={sortLink('articles', option.id)}
                  active={articlesSort === option.id}
                  prefetch={false}
                >
                  {option.label}
                </ChipLink>
              ))}
              <ArchiveFilters
                query={query}
                options={{ articlesCategory: categories, articlesTag: tags }}
              />
            </nav>
            <ArchiveRows
              items={articles.items}
              filtered={Boolean(articlesCategory || articlesTag)}
            />
            <Pagination
              prefetch={false}
              prev={articlesPage > 1 ? pageLink('articles', articlesPage - 1) : undefined}
              next={
                articlesPage * articles.pageSize < articles.total
                  ? pageLink('articles', articlesPage + 1)
                  : undefined
              }
            />
          </section>
          <section
            className="archive-col archive-col-posts"
            id="posts"
            aria-labelledby="archive-posts-title"
          >
            <div className="archive-col-head">
              <h2 id="archive-posts-title">帖子</h2>
              <span>{posts.total}</span>
            </div>
            <nav className="archive-sort" aria-label="帖子排序方式">
              {sortOptions.map((option) => (
                <ChipLink
                  key={option.id}
                  href={sortLink('posts', option.id)}
                  active={postsSort === option.id}
                  prefetch={false}
                >
                  {option.label}
                </ChipLink>
              ))}
            </nav>
            <ArchiveRows items={posts.items} compact />
            <Pagination
              prefetch={false}
              prev={postsPage > 1 ? pageLink('posts', postsPage - 1) : undefined}
              next={
                postsPage * posts.pageSize < posts.total
                  ? pageLink('posts', postsPage + 1)
                  : undefined
              }
            />
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
