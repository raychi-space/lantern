import Link from 'next/link'
import { contents, contentPath, firstSentence, siteSettings } from '../api'
import type { PublicContent } from '../types'
import { externalLink, publicLinks } from '../links'
import { SocialLinks } from './SocialLinks'
import { PageTransition } from '@/shared/ui/PageTransition'
import { ContentCard } from './ContentCard'

const date = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))

function LatestWriting({ items }: { items: PublicContent[] }) {
  return (
    <section className="home-latest-group home-writings" aria-labelledby="recent-writing">
      <div className="home-list-heading">
        <h3 id="recent-writing">最近的文章</h3>
        <Link href="/writing" transitionTypes={['nav-forward']}>
          全部文章 <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {items.length ? (
        <div className="article-list home-writing-list">
          {items.map((item) => (
            <ContentCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <p className="home-list-empty">更多文章正在准备中。</p>
      )}
    </section>
  )
}

function LatestPosts({ items }: { items: PublicContent[] }) {
  return (
    <section className="home-latest-group home-posts" aria-labelledby="recent-posts">
      <div className="home-list-heading">
        <h3 id="recent-posts">最近的帖子</h3>
        <Link href="/posts" transitionTypes={['nav-forward']}>
          全部帖子 <span aria-hidden="true">↗</span>
        </Link>
      </div>
      {items.length ? (
        <div className="home-post-list">
          {items.map((item) => (
            <Link
              href={contentPath(item)}
              key={item.id}
              className="home-post-item"
              transitionTypes={['nav-forward']}
            >
              <time dateTime={item.publishedAt}>{date(item.publishedAt)}</time>
              {item.title && <h4>{item.title}</h4>}
              {firstSentence(item.bodyMarkdown) && <p>{firstSentence(item.bodyMarkdown)}</p>}
            </Link>
          ))}
        </div>
      ) : (
        <p className="home-list-empty">最近还没有帖子。</p>
      )}
    </section>
  )
}

export async function HomePage() {
  const [settings, writing, posts] = await Promise.all([
    siteSettings(),
    contents({ type: 'ARTICLE', pageSize: 4 }),
    contents({ type: 'POST', pageSize: 3 }),
  ])
  const featured = writing.items[0]
  const socialLinks = publicLinks([...settings.accounts, ...settings.contacts])
  const homepage = settings.homepage
  const projects = homepage.projects

  return (
    <PageTransition>
      <main className="home-page">
        <section className="home-intro-grid" aria-label="站主介绍与最近内容">
          <div className="home-profile">
            {settings.avatarUrl ? (
              <img
                className="home-avatar"
                src={settings.avatarUrl}
                alt={`${settings.siteName}头像`}
              />
            ) : (
              <span className="home-avatar home-avatar-default" aria-hidden="true">
                ✳
              </span>
            )}
            <p className="home-kicker">一个人的工作室</p>
            <h1>{settings.siteName}</h1>
            <p className="home-bio">{settings.intro}</p>
            {homepage.focus && (
              <div className="home-focus">
                <span>当前关注</span>
                <strong>{homepage.focus}</strong>
              </div>
            )}
            {socialLinks.length > 0 && (
              <div className="home-socials" aria-label="社交账号与外部链接">
                {socialLinks.map((link) => (
                  <Link
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    target={externalLink(link.href) ? '_blank' : undefined}
                    rel={externalLink(link.href) ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            )}
            <SocialLinks accounts={settings.socialAccounts} />
          </div>
          <div className="home-recent">
            <div className="home-section-title">
              <p className="eyebrow">FROM THE DESK</p>
              <h2>最近写下</h2>
            </div>
            <div className="home-recent-sections">
              {homepage.recentSections
                .filter((section) => section.visible)
                .map((section) =>
                  section.id === 'featured' ? (
                    featured ? (
                      <ContentCard item={featured} featured key="featured" />
                    ) : (
                      <div className="home-featured home-featured-empty" key="featured">
                        <p className="home-featured-label">精选文章</p>
                        <h3>第一篇文章正在准备中。</h3>
                        <Link href="/writing" transitionTypes={['nav-forward']}>
                          浏览文章列表 ↗
                        </Link>
                      </div>
                    )
                  ) : section.id === 'posts' ? (
                    <LatestPosts key="posts" items={posts.items} />
                  ) : (
                    <LatestWriting key="writing" items={writing.items.slice(1)} />
                  ),
                )}
            </div>
          </div>
        </section>

        <div className="home-bottom">
          {homepage.bottomSections
            .filter((section) => section.visible)
            .map((section) =>
              section.id === 'projects' ? (
                <section className="home-projects" aria-labelledby="projects-title" key="projects">
                  <div className="home-section-title">
                    <p className="eyebrow">IN PROGRESS</p>
                    <h2 id="projects-title">最近在做</h2>
                    {settings.projectIntro && <p>{settings.projectIntro}</p>}
                  </div>
                  <div className="home-project-grid">
                    {projects.map((project, index) => (
                      <Link
                        className="home-project"
                        key={`${project.href}-${index}`}
                        href={project.href}
                        target={externalLink(project.href) ? '_blank' : undefined}
                        rel={externalLink(project.href) ? 'noopener noreferrer' : undefined}
                      >
                        <div className="home-project-top">
                          <h3>{project.name}</h3>
                          <span>{project.status}</span>
                        </div>
                        <p>{project.description}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              ) : (
                <aside className="home-numbers" aria-label="站点数据" key="stats">
                  <div>
                    <strong>{writing.total}</strong>
                    <span>写过的文章</span>
                  </div>
                  <div>
                    <strong>{posts.total}</strong>
                    <span>发布的帖子</span>
                  </div>
                  <div>
                    <strong>{projects.length}</strong>
                    <span>公开项目</span>
                  </div>
                </aside>
              ),
            )}
        </div>
      </main>
    </PageTransition>
  )
}
