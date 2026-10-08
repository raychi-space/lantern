import { readingOutline } from '../reading-outline'

export function ReadingOutline({ markdown }: { markdown: string }) {
  const { headings, truncated } = readingOutline(markdown)
  if (headings.length < 2) return null
  return (
    <nav className="reading-outline" aria-label="文章目录">
      <details open>
        <summary>文章目录</summary>
        <ol>
          {headings.map(({ id, depth, label }) => (
            <li key={id} className={`reading-depth-${depth}`}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ol>
        {truncated && <p>目录列出前 100 个章节。</p>}
      </details>
    </nav>
  )
}
