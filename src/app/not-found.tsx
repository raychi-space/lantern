import Link from 'next/link'
import { PageTransition } from '@/shared/ui/PageTransition'
import { BrandMark } from '@/shared/ui/BrandMark'

export default function NotFound() {
  return (
    <PageTransition>
      <main className="not-found">
        <BrandMark />
        <h1>这里还没有故事。</h1>
        <p>页面可能已撤回，或者地址还没有被使用。</p>
        <Link className="button-link" href="/" transitionTypes={['nav-back']}>
          回到首页
        </Link>
      </main>
    </PageTransition>
  )
}
