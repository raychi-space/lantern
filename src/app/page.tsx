export { HomePage as default } from '@/features/contents'
import { pageMetadata } from '@/features/contents'

export async function generateMetadata() {
  return pageMetadata(undefined, '/')
}
