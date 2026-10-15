import type { Metadata } from 'next'
import { pageMetadata } from '@/features/contents'
import { readingShelf } from '@/features/reading'
import { ReadingCards } from './ReadingCards'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('拾阅', '/reading', '从持续关注的优秀博客中，拾取最近值得读的文章。')
}

export default async function ReadingPage() {
  const shelf = await readingShelf()
  return (
    <main className="reading-page">
      <header className="reading-intro">
        <p className="section-kicker">COLLECTED READING · 最近 {shelf.displayDays} 天</p>
        <h1>拾阅</h1>
        <p>从持续关注的优秀博客中，拾取最近值得读的文章。</p>
      </header>
      <ReadingCards sources={shelf.sources} />
    </main>
  )
}
