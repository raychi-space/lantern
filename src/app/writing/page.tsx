import { permanentRedirect } from 'next/navigation'
import { archiveHref, ContentList, filterValue, listMetadata } from '@/features/contents'

type Props = {
  searchParams: Promise<{ page?: string; category?: string | string[]; tag?: string | string[] }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { page } = await searchParams
  return listMetadata('ARTICLE', { page })
}

export default async function WritingPage({ searchParams }: Props) {
  const { page, category, tag } = await searchParams
  const articlesCategory = filterValue(category)
  const articlesTag = filterValue(tag)
  if (articlesCategory || articlesTag)
    permanentRedirect(archiveHref({ articlesCategory, articlesTag }))

  const parsed = Number(page ?? '1')
  return <ContentList type="ARTICLE" page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1} />
}
