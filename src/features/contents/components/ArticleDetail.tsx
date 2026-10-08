import { PublicPageView } from '@/shared/ui/PublicPageView'
import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageTransition } from '@/shared/ui/PageTransition'
import type { PublicContent, RelatedArticle } from '../types'
import type { ReactNode } from 'react'
import { ReadingOutline } from './ReadingOutline'
import { remarkReadingHeadings } from '../reading-outline'
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
  return (
    <PageTransition>
      <main className="article-page">
        <PublicPageView path={`/writing/${item.slug}`} />
        <Link href="/writing" className="back-link" transitionTypes={['nav-back']}>
          ← 返回文章
        </Link>
        <header className="article-heading">
          <p className="eyebrow">WRITING / 文章</p>
          <h1>{item.title}</h1>
          {item.summary && <p className="article-summary">{item.summary}</p>}
          <div className="article-meta">
            <time dateTime={item.publishedAt}>
              {new Intl.DateTimeFormat('zh-CN', {
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
        <ReadingOutline markdown={item.bodyMarkdown ?? ''} />
        <article className="prose">
          <Markdown remarkPlugins={[remarkGfm, remarkReadingHeadings]}>
            {item.bodyMarkdown ?? ''}
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
      </main>
    </PageTransition>
  )
}
