import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Heading, Nodes, Root } from 'mdast'

export type ReadingHeading = { id: string; depth: number; label: string }

function walk(node: Nodes, heading: (node: Heading) => void) {
  if (node.type === 'heading') heading(node)
  if ('children' in node) for (const child of node.children) walk(child, heading)
}

function text(node: Nodes): string {
  if ('value' in node && node.type !== 'html') return node.value
  if (node.type === 'image' || node.type === 'imageReference') return node.alt ?? ''
  if (node.type === 'break') return ' '
  return 'children' in node ? node.children.map(text).join('') : ''
}

// Render and outline assign IDs in the same AST order, including nested headings.
function identify(root: Root) {
  let index = 0
  walk(root, (node) => {
    const id = `reading-section-${++index}`
    const properties = node.data?.hProperties
    node.data = {
      ...node.data,
      hProperties: {
        ...(properties && typeof properties === 'object' ? properties : {}),
        id,
      },
    }
  })
}

export function remarkReadingHeadings() {
  return (root: Root) => identify(root)
}

export function readingOutline(markdown: string): {
  headings: ReadingHeading[]
  truncated: boolean
} {
  const root = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  identify(root)
  // Quoted/list headings still get anchors, but are not document sections.
  const headings = root.children.flatMap((node) => {
    if (node.type !== 'heading' || node.depth < 2 || node.depth > 4) return []
    const label = text(node).replace(/\s+/g, ' ').trim()
    if (!label) return []
    return [{ id: String(node.data?.hProperties?.id), depth: node.depth, label }]
  })
  return { headings: headings.slice(0, 100), truncated: headings.length > 100 }
}
