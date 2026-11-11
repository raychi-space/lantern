import type { Metadata } from 'next'
import { pageMetadata } from '@/features/contents'
import { Discovery, readingDiscovery, readingShelf } from '@/features/reading'
import { ReadingCards } from './ReadingCards'
import { PageTransition } from '@/shared/ui/PageTransition'
import { PageIntro } from '@/shared/ui/PageIntro'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata('拾阅', '/reading', '汇集多方消息，整理值得关注的动态。')
}

export default async function ReadingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const key of ['view', 'period', 'key', 'cursor']) {
    const value = params[key]
    if (value !== undefined) query.set(key, typeof value === 'string' ? value : 'invalid')
  }
  let discovery
  try {
    discovery = await readingDiscovery(query)
  } catch {
    return (
      <PageTransition>
        <main className="inner-page discovery-page">
          <PageIntro kicker="READING" title="拾阅" />
          <p role="status">暂时无法加载，请检查筛选条件后重试。</p>
          <a href={`${process.env.RAYCHI_BASE_PATH ?? ''}/reading`}>返回拾阅</a>
        </main>
      </PageTransition>
    )
  }
  if (discovery?.mode === 'aihot')
    return (
      <PageTransition>
        <main className="inner-page discovery-page">
          <PageIntro kicker="READING" title="拾阅" />
          <Discovery data={discovery} />
        </main>
      </PageTransition>
    )
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
