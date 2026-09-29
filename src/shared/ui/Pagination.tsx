import Link from 'next/link'

export function Pagination({ prev, next }: { prev?: string; next?: string }) {
  if (!prev && !next) return null
  return <nav className="pagination" aria-label="分页">
    {prev && <Link href={prev} transitionTypes={['nav-back']}>← 上一页</Link>}
    {next && <Link href={next} transitionTypes={['nav-forward']}>下一页 →</Link>}
  </nav>
}
