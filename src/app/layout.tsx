import type { Metadata } from 'next'
import Link from 'next/link'
import { siteSettings, publicLinks, externalLink, SocialLinks } from '@/features/contents'
import { SiteNav } from '@/shared/ui/SiteNav'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import './globals.css'

const themeInit = `try{if(localStorage.getItem('lantern-theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}`

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
  return <html lang="zh-CN" suppressHydrationWarning><body>
    <script dangerouslySetInnerHTML={{ __html: themeInit }} />
    <div className="site-shell">
      <div className="night-sky" aria-hidden="true">
        <div className="nebula nebula-gold" /><div className="nebula nebula-blue" />
        <div className="stars stars-a" /><div className="stars stars-b" />
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="site-logo" aria-label={`${settings.siteName} 首页`}><span className="logo-mark">✳</span><span>{settings.siteName}</span></Link>
          <SiteNav configuredLinks={settings.navigation} />
          <div className="header-tools"><ThemeToggle /></div>
        </div>
      </header>
      {children}
      <footer className="site-footer"><span>{settings.siteName} © {new Date().getFullYear()}</span>
        <div className="footer-links">{footerLinks.map(link => <a key={`${link.label}-${link.href}`} href={link.href}
          target={externalLink(link.href) ? '_blank' : undefined}
          rel={externalLink(link.href) ? 'noopener noreferrer' : undefined}>{link.label}</a>)}
          <SocialLinks accounts={settings.socialAccounts} /></div></footer>
    </div>
  </body></html>
}
