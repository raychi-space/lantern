import { sitemapPage } from '@/features/contents'
import { unavailable, xmlResponse } from '@/shared/seo/xml'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  try {
    const body = await sitemapPage((await params).name)
    return body
      ? xmlResponse(body)
      : new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return unavailable()
  }
}
