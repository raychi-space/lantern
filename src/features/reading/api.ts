import { publicApi } from '@/shared/api/publicApi'
import type { DiscoveryPage, ReadingShelf } from './types'

export async function readingShelf(): Promise<ReadingShelf> {
  const result = await publicApi<ReadingShelf>('reading')
  if (!result) throw new Error('Reading API unavailable')
  return result
}

export async function readingDiscovery(query: URLSearchParams): Promise<DiscoveryPage | null> {
  return publicApi<DiscoveryPage>('reading/discovery?' + query, 5000)
}
