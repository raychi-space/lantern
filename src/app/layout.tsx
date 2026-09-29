import type { Metadata } from 'next'
import Link from 'next/link'
import { siteSettings } from '@/features/contents/api'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await siteSettings()
  return { title: { default: `${settings.siteName} · 个人空间`, template: `%s · ${settings.siteName}` },
    description: settings.intro }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await siteSettings()
  return <html lang="zh-CN"><body>
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="site-logo" aria-label={`${settings.siteName} 首页`}><span className="logo-mark">✳</span><span>{settings.siteName}</span></Link>
        <nav aria-label="主导航">{settings.navigation.map(link => <a key={`${link.label}-${link.href}`} href={link.href}>{link.label}</a>)}</nav>
        <span className="header-note">{settings.intro}</span>
      </header>
      {children}
      <footer className="site-footer"><span>{settings.siteName} © {new Date().getFullYear()}</span>
        <div className="footer-links">{[...settings.contacts, ...settings.accounts].map(link => <a key={`${link.label}-${link.href}`} href={link.href}>{link.label}</a>)}</div></footer>
    </div>
  </body></html>
}
