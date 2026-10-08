import { sitemapIndex } from '@/features/contents'
import { unavailable, xmlResponse } from '@/shared/seo/xml'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return xmlResponse(await sitemapIndex())
  } catch {
    return unavailable()
  }
}
