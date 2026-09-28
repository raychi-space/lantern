import { ContentDetail } from '@/features/contents/ContentPages'

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ContentDetail type="THOUGHT" slug={(await params).slug} />
}
