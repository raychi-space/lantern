// Public URLs come from deployment configuration, never request Host headers.
export function siteOrigin(): URL {
  const url = new URL(process.env.RAYCHI_SITE_URL ?? 'https://dev.raychi.site')
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('RAYCHI_SITE_URL must be an HTTP(S) origin without a path or credentials')
  }
  return url
}

export function sitePath(path: string): string {
  const basePath = process.env.RAYCHI_BASE_PATH ?? ''
  return path === '/' && basePath ? basePath : `${basePath}${path}`
}

export function siteUrl(path: string): string {
  return new URL(sitePath(path), siteOrigin()).href
}

export function publicImageUrl(path: string | null): string | undefined {
  if (!path) return undefined
  // Assets use the same-origin API, independent of the frontend's basePath.
  const url = new URL(path, siteOrigin())
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password
    ? url.href
    : undefined
}
