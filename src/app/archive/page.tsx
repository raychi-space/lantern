export { ArchivePage as default } from '@/features/contents'
import { pageMetadata } from '@/features/contents'

export async function generateMetadata() {
  return pageMetadata('回顾', '/archive', '按时间回顾已发布的文章和帖子。')
}
