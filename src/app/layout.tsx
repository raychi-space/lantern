import type { Metadata } from 'next'
import Link from 'next/link'
import { siteSettings, publicLinks, externalLink, SocialLinks } from '@/features/contents'
import { SiteNav } from '@/shared/ui/SiteNav'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { siteOrigin, siteUrl } from '@/shared/seo/site-url'
import './globals.css'
import { AnalyticsPreference } from '@/shared/ui/AnalyticsPreference'

const themeInit = `try{if(localStorage.getItem('lantern-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}`

export async function generateMetadata(): Promise<Metadata> {
  const settings = await siteSettings()
  return {
    metadataBase: siteOrigin(),
    title: { default: `${settings.siteName} · 个人空间`, template: `%s · ${settings.siteName}` },
    description: settings.intro,
    alternates: { types: { 'application/rss+xml': siteUrl('/feed.xml') } },
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await siteSettings()
  const secondaryLinks = publicLinks(settings.navigation).filter(
    (link) => !['/', '/posts', '/writing', '/thoughts', '/archive'].includes(link.href),
  )
  const footerLinks = publicLinks([...secondaryLinks, ...settings.contacts, ...settings.accounts])
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <div className="site-shell">
          <div className="paper-texture" aria-hidden="true" />
          <header className="site-header">
            <div className="header-inner">
              <Link href="/" className="site-logo" aria-label={`${settings.siteName} 首页`}>
                <span className="logo-mark">✳</span>
                <span>{settings.siteName}</span>
              </Link>
              <SiteNav configuredLinks={settings.navigation} />
              <div className="header-tools">
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
          <footer className="site-footer">
            <span>
              {settings.siteName} © {new Date().getFullYear()}
            </span>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={externalLink(link.href) ? '_blank' : undefined}
                  rel={externalLink(link.href) ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <SocialLinks accounts={settings.socialAccounts} />
              <Link href="/feed.xml" prefetch={false}>
                RSS 订阅
              </Link>
              <AnalyticsPreference />
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
