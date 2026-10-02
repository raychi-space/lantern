import type { Metadata } from 'next'
import { content, ContentDetail } from '@/features/contents'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await content('ARTICLE', (await params).slug)
  if (!item) return { title: '文章不存在' }
  return { title: item.title, description: item.summary || undefined }
}

export default async function ArticlePage({ params }: Props) {
  return <ContentDetail type="ARTICLE" slug={(await params).slug} />
}
