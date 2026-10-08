import Link from 'next/link'
import type { RelatedArticle } from '../types'

export function RelatedArticles({ items }: { items: RelatedArticle[] }) {
  if (!items.length) return null
  return (
    <section className="related-articles" aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading">相关文章</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/writing/${encodeURIComponent(item.slug)}`}>
              <h3>{item.title}</h3>
              {item.summary && <p>{item.summary}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
