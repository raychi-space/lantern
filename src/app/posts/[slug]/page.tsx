import { ContentDetail, contentMetadata } from '@/features/contents'
import { commentsConfig, GithubComments } from '@/features/comments'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const metadata = await contentMetadata('POST', (await params).slug)
  return { ...metadata, other: { 'giscus:backlink': String(metadata.alternates?.canonical) } }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const config = commentsConfig()
  return (
    <ContentDetail
      type="POST"
      slug={(await params).slug}
      footer={
        config
          ? (item) => <GithubComments key={item.id} config={config} contentId={item.id} />
          : undefined
      }
    />
  )
}
