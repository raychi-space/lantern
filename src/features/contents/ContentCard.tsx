import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { contentPath, firstSentence, typeNames, type PublicContent } from './api'

const date = (value: string) => new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value))

export function ContentCard({ item }: { item: PublicContent }) {
  const path = contentPath(item)
  if (item.type === 'ARTICLE') return <article className="feed-card article-feed-card">
    <Link className="cover" href={path} aria-label={`阅读${item.title}`}>
      {item.coverUrl ? <img src={item.coverUrl} alt="" /> : <span className="default-cover"><span>✳</span><strong>{item.title}</strong></span>}
    </Link>
    <div className="feed-content"><span className="content-meta">{typeNames[item.type]} · {date(item.publishedAt)}</span>
      <h3><Link href={path}>{item.title}</Link></h3><p>{item.summary || '阅读这篇长文。'}</p>
      <Link className="text-link" href={path}>阅读长文 ↗</Link></div>
  </article>
  const preview = item.bodyMarkdown ?? ''
  const long = item.type === 'THOUGHT' && preview.length > 220
  return <article className="feed-card text-feed-card">
    <span className="content-meta">{typeNames[item.type]} · {date(item.publishedAt)}</span>
    {item.title && <h3><Link href={path}>{item.title}</Link></h3>}
    {long ? <details><summary>{firstSentence(preview)}… <span>展开</span></summary>
      <div className="feed-markdown"><Markdown remarkPlugins={[remarkGfm]} components={{ img: () => null }}>{preview}</Markdown></div></details>
      : <div className="feed-markdown"><Markdown remarkPlugins={[remarkGfm]} components={{ img: () => null }}>{preview}</Markdown></div>}
    <Link className="text-link" href={path}>独立链接 ↗</Link>
  </article>
}
