import Link from 'next/link'
import Markdown from 'react-markdown'
import { PageTransition } from '@/shared/ui/PageTransition'
import type { PublicContent, RelatedArticle } from '../types'
import type { ReactNode } from 'react'
import { ReadingOutline } from './ReadingOutline'
import { readingOutline, remarkReadingHeadings } from '../reading-outline'
import { articleRemarkPlugins, articleRehypePlugins } from '../article-markdown'
import { RelatedArticles } from './RelatedArticles'

export function ArticleDetail({
  item,
  related,
  footer,
}: {
  item: PublicContent
  related: RelatedArticle[]
  footer?: ReactNode
}) {
  const markdown = item.bodyMarkdown ?? ''
  const outline = readingOutline(markdown)
  return (
    <PageTransition>
      <main className="article-page">
        <header className="article-heading">
          <p className="eyebrow">WRITING / 文章</p>
          <h1>{item.title}</h1>
          {item.summary && <p className="article-summary">{item.summary}</p>}
          <div className="article-meta">
            <time dateTime={item.publishedAt}>
              {new Intl.DateTimeFormat('zh-CN', {
                timeZone: 'Asia/Shanghai',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }).format(new Date(item.publishedAt))}
            </time>
            {item.category && (
              <Link href={`/writing?category=${encodeURIComponent(item.category)}`}>
                {item.category}
              </Link>
            )}
            {item.tags.map((tag) => (
              <Link href={`/writing?tag=${encodeURIComponent(tag)}`} key={tag}>
                #{tag}
              </Link>
            ))}
          </div>
        </header>
        <div
          className={`article-reading-layout${outline.headings.length >= 2 ? ' has-outline' : ''}`}
        >
          <ReadingOutline {...outline} />
          <div className="article-reading-content">
            <article className="prose">
              <Markdown
                remarkPlugins={[...articleRemarkPlugins, remarkReadingHeadings]}
                rehypePlugins={articleRehypePlugins}
              >
                {markdown}
              </Markdown>
            </article>
            <div className="article-end">
              <span>✳</span>
              <p>感谢读到这里。</p>
              <Link href="/writing" transitionTypes={['nav-back']}>
                继续读文章 →
              </Link>
            </div>
            <RelatedArticles items={related} />
            {footer}
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
