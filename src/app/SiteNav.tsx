'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SiteLink } from '@/features/contents/api'

const primaryPaths = ['/', '/posts', '/writing', '/archive']

export function SiteNav({ configuredLinks }: { configuredLinks: SiteLink[] }) {
  const pathname = usePathname()
  const links = primaryPaths.flatMap(path => configuredLinks.filter(link => link.href === path).slice(0, 1))
  const currentIndex = primaryPaths.findIndex(path =>
    path === '/' ? pathname === '/' : pathname.startsWith(path))
  return <nav className="main-nav" aria-label="主导航">
    {links.map(link => {
      const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
      const targetIndex = primaryPaths.indexOf(link.href)
      const direction = active || currentIndex === -1 ? undefined
        : targetIndex < currentIndex ? ['nav-back'] : ['nav-forward']
      return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}
        transitionTypes={direction} className={active ? 'active' : undefined}>{link.label}</Link>
    })}
  </nav>
}
