import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { PluggableList } from 'unified'

// The outline and body must parse math identically, including heading-like TeX.
export const articleRemarkPlugins: PluggableList = [remarkGfm, remarkMath]

// rehype-katex keeps invalid TeX readable. Never enable trusted HTML/URL macros.
export const articleRehypePlugins: PluggableList = [
  [rehypeKatex, { trust: false, maxExpand: 1000, maxSize: 20 }],
]
