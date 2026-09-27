import Link from 'next/link'
import { articles } from '@/lib/api'

export default async function HomePage() {
  const recent = await articles(1)
  return <main>
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><span className="tiny-star">✦</span> WELCOME TO MY SPACE</p>
        <h1>你好，<br /><em>进来坐坐。</em></h1>
        <p className="hero-lead">这里放着我认真写下的文章，也记录那些还在路上的想法。你可以从一篇长笺开始，慢慢认识这个空间。</p>
        <Link className="button-link" href="/writing">去读长笺 <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-star">✳</span><span className="art-caption">a little space<br />to think & make</span></div>
    </section>
    <section className="home-section"><div className="section-top"><div><p className="eyebrow">RECENT WRITING</p><h2>最近的长笺</h2></div><Link className="text-link" href="/writing">查看全部 <span>↗</span></Link></div>
      {recent.items.length ? <div className="article-grid">{recent.items.slice(0, 3).map(item => <Link className="article-card" href={`/writing/${item.slug}`} key={item.id}><span className="article-date">{new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.publishedAt))}</span><h3>{item.title}</h3><p>{item.summary || '读一读这篇文章。'}</p><span className="article-arrow">阅读文章 ↗</span></Link>)}</div> : <div className="empty-content"><span>✳</span><p>这里正在准备第一篇长笺。稍后再来看看。</p></div>}
    </section>
  </main>
}
