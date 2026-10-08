import { ContentDetail, contentMetadata } from '@/features/contents'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return contentMetadata('POST', (await params).slug)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ContentDetail type="POST" slug={(await params).slug} />
}
