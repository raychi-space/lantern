import Link from 'next/link'
import type { ReactNode } from 'react'

export function ChipLink({
  href,
  active = false,
  prefetch,
  children,
}: {
  href: string
  active?: boolean
  prefetch?: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={active ? 'chip active' : 'chip'}
      aria-current={active ? 'true' : undefined}
    >
      {children}
    </Link>
  )
}
