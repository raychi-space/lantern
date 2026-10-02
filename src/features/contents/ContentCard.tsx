import Link from 'next/link'
import { contentPath, firstSentence, typeNames, type PublicContent } from './api'

const date = (value: string) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))

export function ContentCard({ item, featured = false }: { item: PublicContent; featured?: boolean }) {
  const path = contentPath(item)
  const summary = item.summary || firstSentence(item.bodyMarkdown)
  return <Link className={`article-row${featured ? ' article-row-featured' : ''}`} href={path} transitionTypes={['nav-forward']}>
    {featured && <span className="article-cover" aria-hidden="true">
      {item.coverUrl ? <img src={item.coverUrl} alt="" /> : <span className="article-cover-fallback">✳</span>}
    </span>}
    <div className="article-row-copy"><h3>{item.title}</h3>
      <div className="article-row-meta"><span>{item.category || typeNames[item.type]}</span><time dateTime={item.publishedAt}>{date(item.publishedAt)}</time></div>
      {summary && <p>{summary}</p>}</div>
  </Link>
}
