import { rssFeed } from '@/features/contents'
import { unavailable, xmlResponse } from '@/shared/seo/xml'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return xmlResponse(await rssFeed(), 'application/rss+xml')
  } catch {
    return unavailable()
  }
}
