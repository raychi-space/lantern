import Link from 'next/link'
import { contentPath, typeNames, type PublicContent } from './api'

const date = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))

export function ContentCard({ item }: { item: PublicContent }) {
  const path = contentPath(item)
  return <article className="feed-card article-feed-card">
    <Link className="cover" href={path} aria-label={`阅读${item.title}`}>
      {item.coverUrl ? <img src={item.coverUrl} alt="" /> : <span className="default-cover"><span>✳</span><strong>{item.title}</strong></span>}
    </Link>
    <div className="feed-content"><span className="content-meta">{typeNames[item.type]} · {date(item.publishedAt)}</span>
      <h3><Link href={path}>{item.title}</Link></h3><p>{item.summary || '阅读这篇文章。'}</p>
      <Link className="text-link" href={path}>阅读文章 ↗</Link></div>
  </article>
}
