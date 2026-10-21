import type { ReactNode } from 'react'

/** 统一的页面头：黄色英文分类标签 + 标题 + 可选描述。所有内页共用，保证切换页面时标签位置一致。 */
export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      {children}
    </header>
  )
}
