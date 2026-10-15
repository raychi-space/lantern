import { publicApi } from '@/shared/api/publicApi'
import type { ReadingShelf } from './types'

export async function readingShelf(): Promise<ReadingShelf> {
  const result = await publicApi<ReadingShelf>('reading')
  if (!result) throw new Error('Reading API unavailable')
  return result
}
