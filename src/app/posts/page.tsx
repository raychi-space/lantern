import { ContentList, listMetadata } from '@/features/contents'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>
}) {
  return listMetadata('POST', await searchParams)
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>
}) {
  const params = await searchParams
  const parsed = Number(params.page ?? '1')
  return (
    <ContentList
      type="POST"
      page={Number.isInteger(parsed) && parsed > 0 ? parsed : 1}
      tag={params.tag}
    />
  )
}
