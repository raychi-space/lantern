'use client'

import { useEffect, useRef, useState } from 'react'
import type { DiscoveryEntry } from './types'

export function SourceDisclosure({ sources }: { sources: DiscoveryEntry['sources'] }) {
  const details = useRef<HTMLDetailsElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const animation = useRef<Animation | null>(null)
  const targetOpen = useRef(false)
  const [closing, setClosing] = useState(false)
  useEffect(() => () => animation.current?.cancel(), [])

  function toggle(event: React.MouseEvent<HTMLElement>) {
    const element = details.current
    const panel = content.current
    if (!element || !panel || !element.animate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animation.current?.cancel()
      animation.current = null
      element.style.height = ''
      element.style.overflow = ''
      setClosing(false)
      return
    }
    event.preventDefault()
    const start = element.getBoundingClientRect().height
    const opening = animation.current ? !targetOpen.current : !element.open
    animation.current?.cancel()
    targetOpen.current = opening
    setClosing(!opening)
    element.open = true
    const summary = element.querySelector('summary')!
    const end =
      summary.getBoundingClientRect().height + (opening ? panel.getBoundingClientRect().height : 0)
    element.style.overflow = 'hidden'
    animation.current = element.animate(
      { height: [start + 'px', end + 'px'] },
      { duration: 240, easing: 'ease' },
    )
    animation.current.onfinish = () => {
      element.open = opening
      element.style.overflow = ''
      animation.current = null
      setClosing(false)
    }
  }
  return (
    <details className="discovery-sources" ref={details} data-closing={closing || undefined}>
      <summary onClick={toggle}>
        查看原文来源（{sources.length}）
        <svg className="discovery-source-chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="discovery-source-content" ref={content}>
        <ul>
          {sources.map((source, i) => (
            <li key={source.url + i}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                <span>{source.name || '原文'}</span> {source.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}
