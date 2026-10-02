import { ViewTransition, type ReactNode } from 'react'

// 路由切换即 React Transition。未标记方向的导航走 page（淡出+上浮），
// 带 transitionTypes 的链接走 nav-forward / nav-back（水平平移）。
const animation = {
  'nav-forward': 'nav-forward',
  'nav-back': 'nav-back',
  default: 'page',
} as const

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={animation} exit={animation} default="none">
      {children}
    </ViewTransition>
  )
}
