import { ContentList, listMetadata } from '@/features/contents'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>
}) {
  return listMetadata('ARTICLE', await searchParams)
}

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; tag?: string }>
}) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  return (
    <ContentList
      type="ARTICLE"
      page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1}
      category={params.category}
      tag={params.tag}
    />
  )
}
