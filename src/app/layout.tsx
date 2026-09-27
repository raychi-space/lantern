import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Raychi · 个人空间', template: '%s · Raychi' },
  description: '文章、想法与作品，慢慢在这里汇集。',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="site-logo" aria-label="Raychi 首页"><span className="logo-mark">✳</span><span>Raychi</span></Link>
        <nav aria-label="主导航"><Link href="/">门廊</Link><Link href="/writing">长笺 <small>文章</small></Link></nav>
        <span className="header-note">一个正在生长的个人空间</span>
      </header>
      {children}
      <footer className="site-footer"><span>Raychi © {new Date().getFullYear()}</span><span>留一点光，给下一次相遇。</span></footer>
    </div>
  </body></html>
}
