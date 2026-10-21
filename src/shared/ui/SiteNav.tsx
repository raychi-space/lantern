'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SiteLink } from '@/shared/types/navigation'

const primaryPaths = ['/', '/posts', '/writing', '/archive', '/reading', '/more']

export function SiteNav({ configuredLinks }: { configuredLinks: SiteLink[] }) {
  const pathname = usePathname()
  const links = primaryPaths.flatMap((path) => {
    const configured = configuredLinks.find((link) => link.href === path)
    return configured
      ? [configured]
      : path === '/reading'
        ? [{ label: '拾阅', href: '/reading' }]
        : []
  })
  const currentIndex = primaryPaths.findIndex((path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path),
  )
  return (
    <nav className="main-nav" aria-label="主导航">
      {links.map((link) => {
        const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
        const targetIndex = primaryPaths.indexOf(link.href)
        const direction =
          active || currentIndex === -1
            ? undefined
            : targetIndex < currentIndex
              ? ['nav-back']
              : ['nav-forward']
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            transitionTypes={direction}
            className={active ? 'active' : undefined}
          >
            {link.label}
          </Link>
        )
      })}
      <Link
        href="/search"
        aria-label="搜索文章和帖子"
        aria-current={pathname === '/search' ? 'page' : undefined}
        className={pathname === '/search' ? 'active' : undefined}
        transitionTypes={pathname === '/search' ? undefined : ['nav-forward']}
      >
        搜索
      </Link>
    </nav>
  )
}
