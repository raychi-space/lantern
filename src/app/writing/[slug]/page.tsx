import type { Metadata } from 'next'
import { contentMetadata, ContentDetail } from '@/features/contents'
import { commentsConfig, GithubComments } from '@/features/comments'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata = await contentMetadata('ARTICLE', (await params).slug)
  return { ...metadata, other: { 'giscus:backlink': String(metadata.alternates?.canonical) } }
}

export default async function ArticlePage({ params }: Props) {
  const config = commentsConfig()
  return (
    <ContentDetail
      type="ARTICLE"
      slug={(await params).slug}
      footer={
        config
          ? (item) => <GithubComments key={item.id} config={config} contentId={item.id} />
          : undefined
      }
    />
  )
}
