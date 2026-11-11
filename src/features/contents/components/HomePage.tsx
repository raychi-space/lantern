import Link from 'next/link'
import Image from 'next/image'
import headphoneGirlAvatar from '@/shared/assets/headphone-girl-avatar.webp'
import { contents, siteSettings } from '../api'
import type { PublicContent } from '../types'
import { externalLink, publicLinks } from '../links'
import { SocialLinks } from './SocialLinks'
import { PageTransition } from '@/shared/ui/PageTransition'
import { ContentCard } from './ContentCard'
import { EmptyState } from '@/shared/ui/EmptyState'
import { PostTimeline } from './PostTimeline'

function LatestWriting({ items }: { items: PublicContent[] }) {
  return (
    <section className="home-latest-group home-writings" aria-labelledby="recent-writing">
      <div className="home-list-heading">
        <h3 id="recent-writing">最近的文章</h3>
        <Link href="/writing" transitionTypes={['nav-forward']}>
          全部文章
        </Link>
      </div>
      {items.length ? (
        <div className="article-list home-writing-list">
          {items.map((item) => (
            <ContentCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <EmptyState inline>更多文章正在路上。</EmptyState>
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
              <Image
                className="home-avatar"
                src={headphoneGirlAvatar}
                alt={`${settings.siteName}头像`}
                sizes="(max-width: 650px) 104px, 128px"
              />
            )}
            <p className="home-kicker">Mia San Mia</p>
            <h1>{settings.siteName}</h1>
            <p className="home-bio">{settings.intro}</p>
            {homepage.focus && (
              <div className="home-focus">
                {/* <span>当前关注</span> */}
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
                  </Link>
                ))}
              </div>
            )}
            <SocialLinks accounts={settings.socialAccounts} />
          </div>
          <div className="home-recent">
            <div className="home-section-title">
              <p className="eyebrow">FROM THE DESK</p>
              <h2>最近内容：</h2>
            </div>
            <div className="home-recent-sections">
              {homepage.recentSections
                .filter(
                  (section) =>
                    section.visible && (section.id === 'featured' || section.id === 'writing'),
                )
                .map((section) =>
                  section.id === 'featured' ? (
                    featured ? (
                      <ContentCard item={featured} featured key="featured" />
                    ) : (
                      <div className="home-featured home-featured-empty" key="featured">
                        <p className="home-featured-label">精选文章</p>
                        <h3>第一篇文章正在准备中。</h3>
                        <Link href="/writing" transitionTypes={['nav-forward']}>
                          浏览文章列表
                        </Link>
                      </div>
                    )
                  ) : (
                    <LatestWriting key="writing" items={writing.items.slice(1)} />
                  ),
                )}
            </div>
          </div>
        </section>

        <section className="home-posts-section" aria-labelledby="home-posts-title">
          <div className="home-list-heading home-section-title">
            <h2 id="home-posts-title">帖子</h2>
            <Link href="/posts" transitionTypes={['nav-forward']}>
              全部帖子
            </Link>
          </div>
          {posts.items.length ? (
            <PostTimeline items={posts.items} />
          ) : (
            <EmptyState inline>最近还没有帖子。</EmptyState>
          )}
        </section>

        <section className="home-projects" aria-labelledby="projects-title">
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
      </main>
    </PageTransition>
  )
}
