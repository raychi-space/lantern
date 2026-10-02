import Link from 'next/link'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PageTransition } from '@/shared/ui/PageTransition'
import type { PublicContent } from '../types'

export function ArticleDetail({ item }: { item: PublicContent }) {
  return (
    <PageTransition>
      <main className="article-page">
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
        <article className="prose">
          <Markdown remarkPlugins={[remarkGfm]}>{item.bodyMarkdown ?? ''}</Markdown>
        </article>
        <div className="article-end">
          <span>✳</span>
          <p>感谢读到这里。</p>
          <Link href="/writing" transitionTypes={['nav-back']}>
            继续读文章 →
          </Link>
        </div>
      </main>
    </PageTransition>
  )
}
