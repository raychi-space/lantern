import type { Metadata } from 'next'
import Link from 'next/link'
import { siteSettings } from '@/features/contents/api'
import { publicLinks, externalLink } from '@/features/contents/links'
import { SiteNav } from './SiteNav'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await siteSettings()
  return { title: { default: `${settings.siteName} · 个人空间`, template: `%s · ${settings.siteName}` },
    description: settings.intro }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await siteSettings()
  const secondaryLinks = publicLinks(settings.navigation).filter(link =>
    !['/', '/posts', '/writing', '/thoughts', '/archive'].includes(link.href))
  const footerLinks = publicLinks([...secondaryLinks, ...settings.contacts, ...settings.accounts])
  return <html lang="zh-CN"><body>
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="site-logo" aria-label={`${settings.siteName} 首页`}><span className="logo-mark">✳</span><span>{settings.siteName}</span></Link>
          <SiteNav configuredLinks={settings.navigation} />
        </div>
      </header>
      {children}
      <footer className="site-footer"><span>{settings.siteName} © {new Date().getFullYear()}</span>
        <div className="footer-links">{footerLinks.map(link => <a key={`${link.label}-${link.href}`} href={link.href}
          target={externalLink(link.href) ? '_blank' : undefined}
          rel={externalLink(link.href) ? 'noopener noreferrer' : undefined}>{link.label}</a>)}</div></footer>
    </div>
  </body></html>
}
