export { ArchivePage as default } from '@/features/contents'
import { filterValue, pageMetadata } from '@/features/contents'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ articlesCategory?: string | string[]; articlesTag?: string | string[] }>
}) {
  const { articlesCategory, articlesTag } = await searchParams
  const filtered = Boolean(filterValue(articlesCategory) || filterValue(articlesTag))
  return pageMetadata('回顾', '/archive', '按时间回顾已发布的文章和帖子。', !filtered)
}
