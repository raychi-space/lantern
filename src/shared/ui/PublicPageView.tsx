'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { collectPageView } from '../lib/analytics'

/** One page view per visible navigation; query strings only trigger navigation, never enter the event. */
export function PublicPageView() {
  const path = usePathname()
  const search = useSearchParams()
  const navigation = `${path}?${search.toString()}`
  const lastPath = useRef<string | null>(null)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const schedule = () => {
      if (
        document.visibilityState === 'hidden' ||
        lastPath.current === navigation ||
        timer !== undefined
      )
        return
      timer = setTimeout(() => {
        timer = undefined
        if (document.visibilityState === 'hidden' || lastPath.current === navigation) return
        lastPath.current = navigation
        void collectPageView(path)
      }, 0)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [path, navigation])
  return null
}
