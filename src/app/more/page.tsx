import Link from 'next/link'
import { PageTransition } from '@/shared/ui/PageTransition'
import { pageMetadata } from '@/features/contents'

export async function generateMetadata() {
  return pageMetadata('更多', '/more', '个人空间的更多内容与入口。')
}

export default function MorePage() {
  return (
    <PageTransition>
      <main className="inner-page">
        <div className="page-intro">
          <p className="eyebrow">MORE</p>
          <h1>更多</h1>
          <p>
            其他内容会在这里相遇。现在可以先阅读<Link href="/archive">回顾</Link>。
          </p>
        </div>
      </main>
    </PageTransition>
  )
}
