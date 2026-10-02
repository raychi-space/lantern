'use client'

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang="zh-CN">
      <body>
        <main role="alert">
          <h1>网站暂时无法连接内容服务</h1>
          <p>请稍后重试。</p>
          <button onClick={() => retry()}>重新加载</button>
        </main>
      </body>
    </html>
  )
}
