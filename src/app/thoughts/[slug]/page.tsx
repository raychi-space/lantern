import { permanentRedirect } from 'next/navigation'

export default async function ThoughtPage({ params }: { params: Promise<{ slug: string }> }) {
  permanentRedirect(`/posts/${encodeURIComponent((await params).slug)}`)
}
