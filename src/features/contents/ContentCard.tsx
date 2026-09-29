import Link from 'next/link'
import { contentPath, typeNames, type PublicContent } from './api'

const date = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))

export function ContentCard({ item }: { item: PublicContent }) {
  const path = contentPath(item)
  return <Link className="feed-card article-feed-card" href={path}>
    <span className="cover">
      {item.coverUrl ? <img src={item.coverUrl} alt="" /> : <span className="default-cover"><span>✳</span><strong>{item.title}</strong></span>}
    </span>
    <div className="feed-content"><span className="content-meta">{typeNames[item.type]} · {date(item.publishedAt)}</span>
      <h3>{item.title}</h3>{item.summary && <p>{item.summary}</p>}</div>
  </Link>
}
