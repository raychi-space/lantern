import { ContentList } from '@/features/contents/ContentPages'

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string; tag?: string }> }) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  return <ContentList type="POST" page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1} tag={params.tag} />
}
