import Link from 'next/link'
import { search } from '@/features/search/api'
import { PageTransition } from '@/shared/ui/PageTransition'
import { EmptyState } from '@/shared/ui/EmptyState'
import { pageMetadata } from '@/features/contents'

export async function generateMetadata() {
  return pageMetadata('搜索', '/search', '寻找文章和帖子中的文字。', false)
}
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''
  const type = typeof params.type === 'string' ? params.type : ''
  const query = new URLSearchParams({ q })
  if (type) query.set('type', type)
  if (params.offset) query.set('offset', String(params.offset))
  const { result, error } = q ? await search(query) : {}
  const filter = (value: string) => {
    const p = new URLSearchParams({ q })
    if (value) p.set('type', value)
    return '/search?' + p
  }
  const next = new URLSearchParams(query)
  if (result?.nextOffset != null) next.set('offset', String(result.nextOffset))
  return (
    <PageTransition>
      <main className="inner-page search-page">
        <header className="page-intro">
          <p className="eyebrow">SEARCH</p>
          <h1>搜索</h1>
          <p>寻找文章和帖子中的文字。</p>
        </header>
        <form action={`${process.env.RAYCHI_BASE_PATH ?? ''}/search`} className="search-form">
          <label htmlFor="search-q" className="sr-only">
            搜索关键词
          </label>
          <input
            id="search-q"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="关键词，例如：数据库"
            maxLength={200}
            required
          />
          {type && <input type="hidden" name="type" value={type} />}
          <button type="submit">搜索</button>
        </form>
        <nav className="chip-row" aria-label="搜索类型">
          {[
            ['', '全部'],
            ['article', '文章'],
            ['post', '帖子'],
          ].map(([value, label]) => (
            <Link
              href={filter(value)}
              key={value}
              className={'chip ' + (type === value ? 'active' : '')}
              aria-current={type === value ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        {error ? (
          <div role="alert">
            <EmptyState>{error}</EmptyState>
          </div>
        ) : !q ? (
          <EmptyState>输入关键词开始搜索。</EmptyState>
        ) : (
          <>
            {result?.hits.length ? (
              <div className="search-results">
                {result.hits.map((hit) => (
                  <Link href={hit.href} key={hit.id} className="search-result">
                    <span className="eyebrow">{hit.type === 'article' ? '文章' : '帖子'}</span>
                    <h2>{hit.title}</h2>
                    <p>{hit.snippet}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState>没有找到匹配内容。可以换个关键词试试。</EmptyState>
            )}
            <nav className="search-pagination" aria-label="搜索分页">
              {params.offset && <Link href={filter(type)}>回到第一页</Link>}
              {result?.nextOffset != null && <Link href={'/search?' + next}>下一页 →</Link>}
            </nav>
          </>
        )}
      </main>
    </PageTransition>
  )
}
