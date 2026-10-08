import type { MetadataRoute } from 'next'
import { sitePath, siteUrl } from '@/shared/seo/site-url'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [sitePath('/'), '/api/v1/public/assets/'],
      // Crawlers must be able to read the noindex on search and studio.
      disallow: [...new Set(['/api/', sitePath('/api/')])],
    },
    sitemap: siteUrl('/sitemap.xml'),
  }
}
