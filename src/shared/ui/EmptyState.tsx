import type { ReactNode } from 'react'

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state"><span aria-hidden="true">✳</span><p>{children}</p></div>
}
