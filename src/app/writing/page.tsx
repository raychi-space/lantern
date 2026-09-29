import { ContentList } from '@/features/contents/ContentPages'

export default async function WritingPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; tag?: string }> }) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  return <ContentList type="ARTICLE" page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1}
    category={params.category} tag={params.tag} />
}
