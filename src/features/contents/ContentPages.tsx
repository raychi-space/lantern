import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notFound } from 'next/navigation'
import { ContentCard } from './ContentCard'
import { PostTimeline } from './PostTimeline'
import { content, contents, names, type ContentType } from './api'

const labels = {
  ARTICLE: { title: '文章', intro: '值得慢慢说的事情，写得完整一些。', path: '/writing' },
  POST: { title: '帖子', intro: '按时间写下的短记录。', path: '/posts' },
}

export async function ContentList({ type, page, category, tag }: { type: ContentType; page: number; category?: string; tag?: string }) {
  const [result, categoryNames, tagNames] = await Promise.all([
    contents({ type, page, pageSize: 12, category, tag }),
    type === 'POST' ? Promise.resolve([]) : names('categories'),
    type === 'POST' ? Promise.resolve([]) : names('tags'),
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
    {type === 'POST' && tag && <div className="post-active-tag"><span>正在查看 #{tag}</span><Link href="/posts">查看全部帖子 ×</Link></div>}
    {result.items.length ? type === 'POST' ? <PostTimeline items={result.items} />
      : <div className="feed-grid">{result.items.map(item => <ContentCard item={item} key={item.id} />)}</div>
      : <div className="empty-content"><span>✳</span><p>这里暂时还没有已发布内容。</p></div>}
    <div className="pagination">{page > 1 && <Link href={query(page - 1)}>← 上一页</Link>}
      {page * result.pageSize < result.total && <Link href={query(page + 1)}>下一页 →</Link>}</div>
  </main>
}

export async function ContentDetail({ type, slug }: { type: ContentType; slug: string }) {
  const item = await content(type, slug)
  if (!item) notFound()
  const info = labels[type]
  if (type === 'POST') return <main className="inner-page post-detail-page">
    <h1 className="sr-only">{item.title || '帖子'}</h1>
    <Link href="/posts" className="back-link">← 返回帖子时间线</Link>
    <PostTimeline items={[item]} showPermalink={false} />
  </main>
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
