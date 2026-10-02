'use client'

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <main className="inner-page" role="alert">
      <h1>暂时无法读取内容</h1>
      <p>请稍后重试，已经保存的内容不会受影响。</p>
      <button onClick={() => retry()}>重新加载</button>
    </main>
  )
}
