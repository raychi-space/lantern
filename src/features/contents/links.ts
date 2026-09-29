import type { SiteLink } from './api'

export function publicLinks(links: SiteLink[]): SiteLink[] {
  return links.map(link => ({ label: link.label.trim(), href: link.href.trim() })).filter(link =>
    !!link.label && (/^https?:\/\//i.test(link.href) || /^mailto:/i.test(link.href) ||
      /^tel:/i.test(link.href) || link.href.startsWith('#') ||
      (link.href.startsWith('/') && !link.href.startsWith('//'))))
}

export function externalLink(href: string) {
  return /^https?:\/\//i.test(href)
}
