'use client'

import { useState } from 'react'
import { contentIllustration, IllustrationScene } from '@/features/contents'
import type { ReadingArticle, ReadingSource } from '@/features/reading'
import { EmptyState } from '@/shared/ui/EmptyState'

export function ReadingCards({ sources }: { sources: ReadingSource[] }) {
  return (
    <section className="reading-source-grid" aria-label="博客来源">
      {sources.map((source) => (
        <SourceCard key={source.id} source={source} />
      ))}
    </section>
  )
}

function SourceCard({ source }: { source: ReadingSource }) {
  const [expanded, setExpanded] = useState(false)
  const [featured, ...rest] = source.articles
  const visible = rest.slice(0, 5)
  const extra = rest.slice(5)
  const regionId = `reading-extra-${source.id}`
  return (
    <article className="reading-note">
      <header className="reading-note-head">
        <h2>{source.name}</h2>
        <p>{source.description}</p>
      </header>
      {featured ? (
        <>
          <div className="reading-cover">
            <IllustrationScene
              scene={contentIllustration({
                id: featured.illustrationSeed,
                title: featured.translatedTitle ?? featured.originalTitle,
                summary: '',
                bodyMarkdown: '',
                category: null,
                tags: [],
              })}
              instance={`reading-${source.id}`}
            />
          </div>
          <a
            className="reading-featured"
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>
              {featured.translatedTitle ?? featured.originalTitle}
              <span aria-hidden="true"> ↗</span>
            </strong>
            {featured.translatedTitle && <span>{featured.originalTitle}</span>}
          </a>
          <p className="reading-feature-meta">
            <time dateTime={featured.publishedAt}>{date(featured.publishedAt)}</time>
            <span>最新文章</span>
          </p>
          <ArticleList articles={visible} />
          {extra.length > 0 && (
            <>
              <div
                className="reading-extra"
                id={regionId}
                aria-hidden={!expanded}
                data-expanded={expanded}
              >
                <ArticleList articles={extra} collapsed={!expanded} />
              </div>
              <button
                className="reading-expand"
                type="button"
                aria-expanded={expanded}
                aria-controls={regionId}
                onClick={() => setExpanded((value) => !value)}
              >
                <span aria-hidden="true">{expanded ? '⌃' : '⌄'}</span>
                {expanded ? '收起其余文章' : `展开 90 天内其余 ${extra.length} 篇`}
              </button>
            </>
          )}
        </>
      ) : (
        <EmptyState inline>最近 90 天暂无文章。</EmptyState>
      )}
    </article>
  )
}

function ArticleList({
  articles,
  collapsed = false,
}: {
  articles: ReadingArticle[]
  collapsed?: boolean
}) {
  return (
    <ul className="reading-article-list">
      {articles.map((article) => (
        <li key={article.id}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={collapsed ? -1 : undefined}
          >
            <span>
              <span className="reading-cn-title">
                {article.translatedTitle ?? article.originalTitle}
                <span aria-hidden="true"> ↗</span>
              </span>
              {article.translatedTitle && (
                <span className="reading-original-title">{article.originalTitle}</span>
              )}
            </span>
            <time dateTime={article.publishedAt}>{date(article.publishedAt)}</time>
          </a>
        </li>
      ))}
    </ul>
  )
}

function date(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}
