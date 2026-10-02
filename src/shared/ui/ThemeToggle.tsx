'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'lantern-theme'

export function ThemeToggle() {
  const [light, setLight] = useState(false)
  useEffect(() => { setLight(document.documentElement.dataset.theme === 'light') }, [])

  function toggle() {
    const next = !light
    setLight(next)
    if (next) document.documentElement.dataset.theme = 'light'
    else delete document.documentElement.dataset.theme
    try { localStorage.setItem(STORAGE_KEY, next ? 'light' : 'dark') } catch { /* 隐私模式下忽略 */ }
  }

  return <button type="button" className="theme-toggle" onClick={toggle}
    aria-label={light ? '切换到深色星夜主题' : '切换到浅色纸张主题'} title="切换主题">
    <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" />
    </svg>
    <svg className="icon-moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 14.2A8.5 8.5 0 1 1 9.8 3.6a7 7 0 1 0 10.6 10.6Z" />
    </svg>
  </button>
}
