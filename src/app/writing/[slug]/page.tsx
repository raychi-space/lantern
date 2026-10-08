import type { Metadata } from 'next'
import { contentMetadata, ContentDetail } from '@/features/contents'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return contentMetadata('ARTICLE', (await params).slug)
}

export default async function ArticlePage({ params }: Props) {
  return <ContentDetail type="ARTICLE" slug={(await params).slug} />
}
