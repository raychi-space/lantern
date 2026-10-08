export type CommentsConfig = {
  repo: `${string}/${string}`
  repoId: string
  category: string
  categoryId: string
}

// Read only in the server route. These four identifiers are public, not tokens.
export function commentsConfig(): CommentsConfig | null {
  if (process.env.RAYCHI_GISCUS_ENABLED !== 'true') return null
  const repo = process.env.RAYCHI_GISCUS_REPO?.trim() ?? ''
  const repoId = process.env.RAYCHI_GISCUS_REPO_ID?.trim() ?? ''
  const category = process.env.RAYCHI_GISCUS_CATEGORY?.trim() ?? ''
  const categoryId = process.env.RAYCHI_GISCUS_CATEGORY_ID?.trim() ?? ''
  if (
    !/^[A-Za-z0-9-]{1,39}\/[A-Za-z0-9_.-]{1,100}$/.test(repo) ||
    !/^[A-Za-z0-9_=-]{4,200}$/.test(repoId) ||
    !/^[A-Za-z0-9_=-]{4,200}$/.test(categoryId) ||
    !category ||
    category.length > 100 ||
    /[\u0000-\u001f\u007f]/.test(category)
  )
    return null // An incomplete deployment configuration cannot break reading.
  return { repo: repo as CommentsConfig['repo'], repoId, category, categoryId }
}
