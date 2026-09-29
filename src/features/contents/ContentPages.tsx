import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { ContentCard } from './ContentCard'
import { content, contents, names, type ContentType } from './api'

const labels = {
  ARTICLE: { title: '长文', intro: '值得慢慢说的事情，写得完整一些。', path: '/writing' },
  POST: { title: '帖子', intro: '短一些的记录，随时分享。', path: '/posts' },
  THOUGHT: { title: '思考', intro: '正在形成的想法与问题。', path: '/thoughts' },
}

export async function ContentList({ type, page, category, tag }: { type: ContentType; page: number; category?: string; tag?: string }) {
  const [result, categoryNames, tagNames] = await Promise.all([
    contents({ type, page, pageSize: 12, category, tag }),
    type === 'POST' ? Promise.resolve([]) : names('categories'),
    type === 'THOUGHT' ? Promise.resolve([]) : names('tags'),
  ])
  const info = labels[type]
  const query = (nextPage: number) => {
    const params = new URLSearchParams({ page: String(nextPage) })
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    return `${info.path}?${params}`
  }
  return <main className="inner-page"><div className="page-intro"><p className="eyebrow">{type}</p><h1>{info.title}</h1><p>{info.intro}</p></div>
    {(categoryNames.length > 0 || tagNames.length > 0) && <div className="filters">
      <a href={info.path} className={!category && !tag ? 'active' : ''}>全部</a>
      {categoryNames.map(name => <a href={`${info.path}?category=${encodeURIComponent(name)}`} className={category === name ? 'active' : ''} key={name}>{name}</a>)}
      {tagNames.map(name => <a href={`${info.path}?tag=${encodeURIComponent(name)}`} className={tag === name ? 'active' : ''} key={name}>#{name}</a>)}
    </div>}
    {result.items.length ? <div className="feed-grid">{result.items.map(item => <ContentCard item={item} key={item.id} />)}</div>
      : <div className="empty-content"><span>✳</span><p>这里暂时还没有已发布内容。</p></div>}
    <div className="pagination">{page > 1 && <Link href={query(page - 1)}>← 上一页</Link>}
      {page * result.pageSize < result.total && <Link href={query(page + 1)}>下一页 →</Link>}</div>
  </main>
}

export async function ContentDetail({ type, slug }: { type: ContentType; slug: string }) {
  const item = await content(type, slug)
  if (!item) notFound()
  const info = labels[type]
  return <main className="article-page"><Link href={info.path} className="back-link">← 返回{info.title}</Link>
    <header className="article-heading"><p className="eyebrow">{info.title}</p>
      {item.title && <h1>{item.title}</h1>}
      <div className="article-meta"><time dateTime={item.publishedAt}>{new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.publishedAt))}</time>
        {item.category && <Link href={`${info.path}?category=${encodeURIComponent(item.category)}`}>{item.category}</Link>}
        {item.tags.map(tag => <Link key={tag} href={`${info.path}?tag=${encodeURIComponent(tag)}`}>#{tag}</Link>)}</div></header>
    <article className="prose"><Markdown remarkPlugins={[remarkGfm]} components={{ img: () => null }}>{item.bodyMarkdown ?? ''}</Markdown></article>
    <div className="article-end"><span>✳</span><p>感谢读到这里。</p><Link href={info.path}>继续阅读 →</Link></div>
  </main>
}
