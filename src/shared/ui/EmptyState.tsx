import type { ReactNode } from 'react'

/** 统一的空状态提示。inline 用于列表/卡片内的单行提示，默认用于整页空状态。 */
export function EmptyState({
  children,
  inline = false,
}: {
  children: ReactNode
  inline?: boolean
}) {
  if (inline) return <p className="empty-state-inline">{children}</p>
  return (
    <div className="empty-state">
      <span aria-hidden="true">✳</span>
      <p>{children}</p>
    </div>
  )
}
