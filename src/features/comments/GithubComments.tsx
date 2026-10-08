'use client'

import Giscus from '@giscus/react'
import { useEffect, useRef, useState } from 'react'
import type { CommentsConfig } from './config'

export function GithubComments({
  config,
  contentId,
}: {
  config: CommentsConfig
  contentId: string
}) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [attempt, setAttempt] = useState(0)
  const [theme, setTheme] = useState('light')
  const container = useRef<HTMLDivElement>(null)
  const active = phase === 'loading' || phase === 'ready'

  function load() {
    try {
      // The official widget requires localStorage for its GitHub OAuth session.
      localStorage.getItem('giscus-session')
      setAttempt((value) => value + 1)
      setPhase('loading')
    } catch {
      setPhase('error')
    }
  }

  useEffect(() => {
    const update = () =>
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
    update()
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    // Resume the widget after returning from GitHub's own OAuth flow.
    if (new URL(location.href).searchParams.has('giscus')) load()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!active) return
    const timer = setTimeout(() => setPhase('error'), 15000)
    function message(event: MessageEvent) {
      const frame = container.current
        ?.querySelector('giscus-widget')
        ?.shadowRoot?.querySelector('iframe')
      if (event.origin !== 'https://giscus.app' || !frame || event.source !== frame.contentWindow)
        return
      const payload = event.data?.giscus
      if (!payload || typeof payload !== 'object') return
      if (typeof payload.error === 'string' && !payload.error.includes('Discussion not found')) {
        clearTimeout(timer)
        setPhase('error')
      } else if (
        typeof payload.resizeHeight === 'number' &&
        Number.isFinite(payload.resizeHeight) &&
        payload.resizeHeight > 0
      ) {
        clearTimeout(timer)
        setPhase('ready')
      }
    }
    window.addEventListener('message', message)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('message', message)
    }
  }, [active, attempt])

  return (
    <section className="github-comments" aria-labelledby="comments-heading" id="comments">
      <h2 id="comments-heading">评论</h2>
      <p>使用 GitHub 账号留言，无需注册本站。评论公开保存在 GitHub Discussions。</p>
      {phase === 'idle' && (
        <button type="button" onClick={load}>
          加载 GitHub 评论
        </button>
      )}
      {phase === 'loading' && <p role="status">正在加载评论…</p>}
      {phase === 'error' && (
        <div>
          <p role="alert">评论暂时无法加载，请检查网络或浏览器存储权限。</p>
          <button type="button" onClick={load}>
            重试加载评论
          </button>
        </div>
      )}
      <div ref={container}>
        {active && (
          <Giscus
            key={attempt}
            id="github-comment-widget"
            host="https://giscus.app"
            {...config}
            mapping="specific"
            term={`raychi-content:${contentId}`}
            strict="1"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme={theme}
            lang="zh-CN"
            loading="eager"
          />
        )}
      </div>
      <a
        href={`https://github.com/${config.repo}/discussions`}
        target="_blank"
        rel="noopener noreferrer"
      >
        前往 GitHub 讨论区 ↗
      </a>
    </section>
  )
}
