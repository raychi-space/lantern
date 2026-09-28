import Link from 'next/link'
import { contentPath, contents, firstSentence, names, typeNames, type ContentType, type PublicContent } from '@/features/contents/api'

type Params = { page?: string; type?: string; category?: string; tag?: string }

export default async function ArchivePage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  const page = Number.isInteger(parsed) && parsed > 0 ? parsed : 1
  const type = ['ARTICLE', 'POST', 'THOUGHT'].includes(params.type ?? '') ? params.type as ContentType : undefined
  const [result, categories, tags] = await Promise.all([
    contents({ page, pageSize: 50, type, category: params.category, tag: params.tag }), names('categories'), names('tags'),
  ])
  const groups = new Map<string, PublicContent[]>()
  for (const item of result.items) {
    const key = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit' }).format(new Date(item.publishedAt))
    groups.set(key, [...groups.get(key) ?? [], item])
  }
  const pageLink = (next: number) => {
    const query = new URLSearchParams({ page: String(next) })
    if (type) query.set('type', type)
    if (params.category) query.set('category', params.category)
    if (params.tag) query.set('tag', params.tag)
    return `/archive?${query}`
  }
  return <main className="inner-page"><div className="page-intro"><p className="eyebrow">ARCHIVE</p><h1>回顾</h1>
    <p>按公开时间，翻阅已经写下的内容。</p></div>
    <form className="archive-filters" method="get"><label>类型<select name="type" defaultValue={type ?? ''}><option value="">全部</option>
      {Object.entries(typeNames).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>
      <label>分类<select name="category" defaultValue={params.category ?? ''}><option value="">全部</option>{categories.map(name => <option key={name}>{name}</option>)}</select></label>
      <label>标签<select name="tag" defaultValue={params.tag ?? ''}><option value="">全部</option>{tags.map(name => <option key={name}>{name}</option>)}</select></label>
      <button type="submit">筛选</button></form>
    {groups.size ? [...groups].map(([month, items]) => <section className="archive-month" key={month}><h2>{month}</h2>
      <div>{items.map(item => <Link className="archive-row" href={contentPath(item)} key={item.id}>
        <time dateTime={item.publishedAt}>{new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', day: '2-digit' }).format(new Date(item.publishedAt))}</time>
        <span className="archive-type">{typeNames[item.type]}</span><span><strong>{item.title || firstSentence(item.bodyMarkdown)}</strong>
          <small>{item.title ? firstSentence(item.bodyMarkdown) || item.summary : ''}</small></span><span>↗</span>
      </Link>)}</div></section>) : <div className="empty-content"><span>✳</span><p>这个筛选条件下没有已发布内容。</p></div>}
    <div className="pagination">{page > 1 && <Link href={pageLink(page - 1)}>← 上一页</Link>}
      {page * result.pageSize < result.total && <Link href={pageLink(page + 1)}>下一页 →</Link>}</div>
  </main>
}
