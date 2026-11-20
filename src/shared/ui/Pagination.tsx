import Link from 'next/link'

export function Pagination({
  prev,
  next,
  prefetch,
}: {
  prev?: string
  next?: string
  prefetch?: boolean
}) {
  if (!prev && !next) return null
  return (
    <nav className="pagination" aria-label="分页">
      {prev && (
        <Link href={prev} prefetch={prefetch} transitionTypes={['nav-back']}>
          ← 上一页
        </Link>
      )}
      {next && (
        <Link href={next} prefetch={prefetch} transitionTypes={['nav-forward']}>
          下一页 →
        </Link>
      )}
    </nav>
  )
}
