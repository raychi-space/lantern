import type { Metadata } from 'next'
import Link from 'next/link'
import { articles } from '@/lib/api'

export const metadata: Metadata = { title: '长笺 · 文章' }

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1
  const result = await articles(page)
  return <main className="inner-page">
    <div className="page-intro"><p className="eyebrow">WRITING / 文章</p><h1>长笺</h1><p>把值得慢慢说的事情，写得完整一些。</p></div>
    {result.items.length ? <div className="writing-list">{result.items.map((item, index) => <Link className="writing-row" href={`/writing/${item.slug}`} key={item.id}><span className="row-index">{String((page - 1) * result.pageSize + index + 1).padStart(2, '0')}</span><div><h2>{item.title}</h2><p>{item.summary}</p><div className="tag-list">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><span className="row-date">{new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(item.publishedAt))}</span><span className="row-arrow">↗</span></Link>)}</div> : <div className="empty-content"><span>✳</span><p>这页暂时还没有文章。</p></div>}
    <div className="pagination">{page > 1 && <Link href={`/writing?page=${page - 1}`}>← 上一页</Link>}{page * result.pageSize < result.total && <Link href={`/writing?page=${page + 1}`}>下一页 →</Link>}</div>
  </main>
}
