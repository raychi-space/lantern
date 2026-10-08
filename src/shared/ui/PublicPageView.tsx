'use client'

import { useEffect, useRef } from 'react'
import { collectPageView } from '../lib/analytics'

/** Mount only after a public page has successfully resolved its published data. */
export function PublicPageView({ path }: { path: string }) {
  const lastPath = useRef<string | null>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (document.visibilityState === 'hidden' || lastPath.current === path || timer !== undefined)
        return
      timer = setTimeout(() => {
        timer = undefined
        if (document.visibilityState === 'hidden' || lastPath.current === path) return
        lastPath.current = path
        void collectPageView(path)
      }, 0)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [path])
  return null
}
