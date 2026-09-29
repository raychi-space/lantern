import Link from 'next/link'
import { ContentCard } from '@/features/contents/ContentCard'
import { contents, siteSettings, type PublicContent } from '@/features/contents/api'

const sections = {
  feed: { title: '最近更新', href: '/archive', link: '查看回顾' },
  writing: { title: '长文', href: '/writing', link: '全部长文' },
  posts: { title: '帖子', href: '/posts', link: '全部帖子' },
  thoughts: { title: '思考', href: '/thoughts', link: '全部思考' },
}

export default async function HomePage() {
  const settings = await siteSettings()
  const visible = settings.homeSections.filter(section => section.visible)
  const results = await Promise.all(visible.map(async section => ({
    id: section.id,
    items: (await contents({ pageSize: section.id === 'feed' ? 9 : 3,
      type: section.id === 'writing' ? 'ARTICLE' : section.id === 'posts' ? 'POST' : section.id === 'thoughts' ? 'THOUGHT' : undefined })).items,
  })))
  const grouped = Object.fromEntries(results.map(result => [result.id, result.items])) as Record<string, PublicContent[]>
  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="tiny-star">✦</span> WELCOME TO MY SPACE</p>
      {settings.avatarUrl ? <img className="hero-avatar" src={settings.avatarUrl} alt={`${settings.siteName}头像`} />
        : <span className="hero-avatar default-avatar" aria-label="默认头像">✳</span>}
      <h1>你好，<br /><em>进来坐坐。</em></h1><p className="hero-lead">{settings.intro}</p>
      <Link className="button-link" href="/archive">看看最近更新 <span aria-hidden="true">↗</span></Link></div>
      <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><span className="art-star">✳</span><span className="art-caption">a little space<br />to think & make</span></div></section>
    {visible.map(section => <section className="home-section" key={section.id}>
      <div className="section-top"><div><p className="eyebrow">{section.id.toUpperCase()}</p><h2>{sections[section.id].title}</h2></div>
        <Link className="text-link" href={sections[section.id].href}>{sections[section.id].link} ↗</Link></div>
      {(grouped[section.id] ?? []).length ? <div className="feed-grid">{grouped[section.id].map(item => <ContentCard item={item} key={item.id} />)}</div>
        : <div className="empty-content"><span>✳</span><p>这里暂时还没有已发布内容。</p></div>}
    </section>)}
  </main>
}
