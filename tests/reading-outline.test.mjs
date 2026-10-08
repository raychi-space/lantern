import test from 'node:test'
import assert from 'node:assert/strict'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import { readingOutline, remarkReadingHeadings } from '../src/features/contents/reading-outline.ts'

test('outline and renderer agree for GFM, nested headings, duplicate Chinese and Setext', () => {
  const body = '# 标题\n\n## **中文** [链接](https://example.com) `代码`\n\n```md\n## 不是标题\n```\n\n> ## 引用内标题\n\n## 重复\n\n### 重复\n\n四级 ![图片替代文字](image.png)\n----\n\n#### 子节\n\n##### 五级不列目录\n\n<div>\n## 原始 HTML 不算标题\n</div>'
  const result = readingOutline(body)
  assert.deepEqual(result, { truncated: false, headings: [
    { id: 'reading-section-2', depth: 2, label: '中文 链接 代码' },
    { id: 'reading-section-4', depth: 2, label: '重复' },
    { id: 'reading-section-5', depth: 3, label: '重复' },
    { id: 'reading-section-6', depth: 2, label: '四级 图片替代文字' },
    { id: 'reading-section-7', depth: 4, label: '子节' },
  ] })
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkReadingHeadings)
  const tree = processor.runSync(processor.parse(body))
  for (const entry of result.headings) {
    assert.ok(tree.children.some(node => node.type === 'heading' && node.depth === entry.depth && node.data?.hProperties?.id === entry.id))
  }
})

test('large outlines are bounded, IDs are unique, empty/raw/code text excluded', () => {
  assert.deepEqual(readingOutline('正文\n\n```\n## 示例\n```\n\n##'), { headings: [], truncated: false })
  const result = readingOutline(Array.from({ length: 105 }, () => '## 相同标题').join('\n\n'))
  assert.equal(result.headings.length, 100)
  assert.equal(result.truncated, true)
  assert.equal(new Set(result.headings.map(row => row.id)).size, 100)
})
