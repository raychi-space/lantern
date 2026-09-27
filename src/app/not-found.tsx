import Link from 'next/link'

export default function NotFound() {
  return <main className="not-found"><span>✳</span><h1>这里还没有故事。</h1><p>页面可能已撤回，或者地址还没有被使用。</p><Link className="button-link" href="/">回到门廊 ↗</Link></main>
}
