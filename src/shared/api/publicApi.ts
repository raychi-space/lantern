import { cache } from 'react'

const base = process.env.RAYCHI_API_URL ?? 'http://127.0.0.1:8080'

export const publicApi = cache(async function publicApi<T>(path: string): Promise<T | null> {
  const response = await fetch(`${base}/api/v1/public/${path}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Public API returned ${response.status}`)
  return response.json() as Promise<T>
})
