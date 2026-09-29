import { ContentList } from '@/features/contents/ContentPages'

export default async function ThoughtsPage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  return <ContentList type="THOUGHT" page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1} category={params.category} />
}
