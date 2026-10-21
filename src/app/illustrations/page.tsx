import type { Metadata } from 'next'
import { CoverGallery } from '@/features/contents'
import { PageTransition } from '@/shared/ui/PageTransition'
import { PageIntro } from '@/shared/ui/PageIntro'

export const metadata: Metadata = {
  title: '插画预览',
  description: '比较文章缺省封面的不同场景与生成结果。',
  robots: { index: false, follow: false },
}

export default function IllustrationsPage() {
  return (
    <PageTransition>
      <main className="inner-page illustration-preview-page">
        <PageIntro kicker="A LITTLE GALLERY" title="插画预览">
          <p>十八种题材，六种天气。高楼、屋顶、山谷、器物，都可以成为画面的主角。</p>
        </PageIntro>
        <CoverGallery />
      </main>
    </PageTransition>
  )
}
