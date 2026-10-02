import type { PublicContent } from '../types'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { contentPath, firstSentence } from '../api'
import { ChipLink } from '@/shared/ui/Chip'

const month = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long' })
const day = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', day: 'numeric' })
const clock = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

export function PostTimeline({ items, linkToDetail = true }: { items: PublicContent[]; linkToDetail?: boolean }) {
  let currentMonth = ''
  return <div className="timeline">{items.map(item => {
    const published = new Date(item.publishedAt)
    const label = month.format(published)
    const showMonth = label !== currentMonth
    currentMonth = label
    return <div className="timeline-group" key={item.id}>
      {showMonth && <h2 className="timeline-month">{label}</h2>}
      <article className="timeline-entry">
        <time dateTime={item.publishedAt} className="timeline-date"><strong>{day.format(published)}</strong><span>{clock.format(published)}</span></time>
        <div className="timeline-content">
          <div className={linkToDetail ? 'post-entry-text linked' : 'post-entry-text'}>
            {item.title && <h3>{linkToDetail ? <Link href={contentPath(item)} className="post-text-link" transitionTypes={['nav-forward']}>{item.title}</Link> : item.title}</h3>}
            {linkToDetail && !item.title && <Link href={contentPath(item)} className="post-text-link" transitionTypes={['nav-forward']}><span className="sr-only">打开帖子：{firstSentence(item.bodyMarkdown) || '无标题帖子'}</span></Link>}
            <div className="post-body"><Markdown remarkPlugins={[remarkGfm]} components={{ img: () => null }}>{item.bodyMarkdown ?? ''}</Markdown></div>
          </div>
          {item.tags.length > 0 && <div className="timeline-footer">
            {item.tags.length > 0 && <div className="post-tags">{item.tags.map(tag =>
              <ChipLink href={`/posts?tag=${encodeURIComponent(tag)}`} key={tag}>#{tag}</ChipLink>)}</div>}
          </div>}
        </div>
      </article>
    </div>
  })}</div>
}
