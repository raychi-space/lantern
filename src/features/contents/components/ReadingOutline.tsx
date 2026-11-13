import type { readingOutline } from '../reading-outline'

type Outline = ReturnType<typeof readingOutline>

function OutlineLinks({ headings, truncated }: Outline) {
  return (
    <>
      <ol>
        {headings.map(({ id, depth, label }) => (
          <li key={id} className={`reading-depth-${depth}`}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ol>
      {truncated && <p>目录列出前 100 个章节。</p>}
    </>
  )
}

export function ReadingOutline(outline: Outline) {
  const { headings } = outline
  if (headings.length < 2) return null
  return (
    <nav className="reading-outline" aria-label="文章目录">
      <div className="reading-outline-desktop">
        <h2>文章目录</h2>
        <OutlineLinks {...outline} />
      </div>
      <details className="reading-outline-mobile">
        <summary>文章目录</summary>
        <OutlineLinks {...outline} />
      </details>
    </nav>
  )
}
