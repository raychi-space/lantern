import {
  siGithub,
  siX,
  siBilibili,
  siYoutube,
  siZhihu,
  siJuejin,
  siXiaohongshu,
  siMastodon,
} from 'simple-icons'
import type { SocialAccount } from '../types'

const platforms = {
  github: { name: 'GitHub', path: siGithub.path },
  x: { name: 'X', path: siX.path },
  bilibili: { name: '哔哩哔哩', path: siBilibili.path },
  youtube: { name: 'YouTube', path: siYoutube.path },
  zhihu: { name: '知乎', path: siZhihu.path },
  juejin: { name: '掘金', path: siJuejin.path },
  xiaohongshu: { name: '小红书', path: siXiaohongshu.path },
  mastodon: { name: 'Mastodon', path: siMastodon.path },
} as const

export function SocialLinks({ accounts }: { accounts: SocialAccount[] }) {
  const visible = accounts.filter(
    (account) =>
      account.enabled && /^https?:\/\/[^\s]+$/i.test(account.href) && account.platform in platforms,
  )
  if (!visible.length) return null
  return (
    <div className="social-icons" aria-label="外部账户">
      {visible.map((account) => {
        const platform = platforms[account.platform as keyof typeof platforms]
        return (
          <a
            key={account.platform}
            href={account.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            title={platform.name}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={platform.path} />
            </svg>
          </a>
        )
      })}
    </div>
  )
}
