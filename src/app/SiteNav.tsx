'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SiteLink } from '@/features/contents/api'

const defaults = [
  { label: '首页', href: '/' },
  { label: '帖子', href: '/posts' },
  { label: '文章', href: '/writing' },
  { label: '回顾', href: '/archive' },
]

export function SiteNav({ configuredLinks }: { configuredLinks: SiteLink[] }) {
  const pathname = usePathname()
  const links = defaults.map(link => ({
    ...link,
    label: (() => {
      const configured = configuredLinks.find(item => item.href === link.href)?.label
      return link.href === '/writing' && configured === '长文' ? '文章' : configured || link.label
    })(),
  }))
  return <nav className="main-nav" aria-label="主导航">
    {links.map(link => {
      const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
      return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined}
        className={active ? 'active' : undefined}>{link.label}</Link>
    })}
  </nav>
}
