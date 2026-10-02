import { ContentDetail } from '@/features/contents'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ContentDetail type="POST" slug={(await params).slug} />
}
