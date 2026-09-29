import Link from 'next/link'
import type { ReactNode } from 'react'

export function ChipLink({ href, active = false, children }: { href: string; active?: boolean; children: ReactNode }) {
  return <Link href={href} className={active ? 'chip active' : 'chip'}
    aria-current={active ? 'true' : undefined}>{children}</Link>
}
