import type { Metadata } from 'next'
import { pageMetadata } from '@/features/contents'
import { readingShelf } from '@/features/reading'
import { ReadingCards } from './ReadingCards'
import { PageTransition } from '@/shared/ui/PageTransition'
import { PageIntro } from '@/shared/ui/PageIntro'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('拾阅', '/reading', '从持续关注的优秀博客中，拾取最近值得读的文章。')
}

export default async function ReadingPage() {
  const shelf = await readingShelf()
  return (
    <PageTransition>
      <main className="inner-page">
        <PageIntro kicker="READING" title="拾阅">
          <p>从持续关注的优秀博客中，拾取最近 {shelf.displayDays} 天值得读的文章。</p>
        </PageIntro>
        <ReadingCards sources={shelf.sources} />
      </main>
    </PageTransition>
  )
}
