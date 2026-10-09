import type { Metadata } from 'next'
import { CoverGallery } from '@/features/contents'
import { PageTransition } from '@/shared/ui/PageTransition'

export const metadata: Metadata = {
  title: '插画预览',
  description: '比较文章缺省封面的不同场景与生成结果。',
  robots: { index: false, follow: false },
}

export default function IllustrationsPage() {
  return (
    <PageTransition>
      <main className="inner-page illustration-preview-page">
        <header className="page-intro">
          <p className="eyebrow">A LITTLE GALLERY</p>
          <h1>插画预览</h1>
          <p>十八种题材，六种天气。高楼、屋顶、山谷、器物，都可以成为画面的主角。</p>
        </header>
        <CoverGallery />
      </main>
    </PageTransition>
  )
}
