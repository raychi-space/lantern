import test from 'node:test'
import assert from 'node:assert/strict'
import { contentIllustration } from '../src/features/contents/content-illustration.ts'

const article = {
  id: 'public-article-1', title: '海边散步', summary: '听潮声',
  bodyMarkdown: '在岛上看海。', category: '', tags: [],
}

test('covers remain deterministic across repeated and interleaved renders', () => {
  const expected = contentIllustration(article)
  contentIllustration({ ...article, id: 'another-article', title: '夜里的梦' })
  assert.deepEqual(contentIllustration({ ...article }), expected)
  assert.equal(expected.theme, 'sea')
  assert.deepEqual(contentIllustration({ ...article, title: ' 海边散步  ' }), expected)
})

test('published content and identity vary the cover while metadata does not', () => {
  const original = contentIllustration(article)
  assert.notDeepEqual(contentIllustration({ ...article, bodyMarkdown: '在岛上写下新的故事。' }), original)
  assert.notDeepEqual(contentIllustration({ ...article, id: 'public-article-2' }), original)
  assert.deepEqual(contentIllustration({ ...article, publishedAt: '2030-01-01', slug: 'new-path' }), original)
  const varied = Array.from({ length: 100 }, (_, i) => contentIllustration({ ...article, id: String(i) }))
  assert.equal(new Set(varied.map((scene) => JSON.stringify(scene))).size, 100)
})

test('content keywords select scenes and empty or unusual text is safe', () => {
  for (const [title, theme] of [['大海和潮汐', 'sea'], ['月夜星空', 'night'], ['阅读代码', 'room'], ['森林花园', 'garden'], ['城市街道', 'city']]) {
    assert.equal(contentIllustration({ ...article, title, summary: '', bodyMarkdown: null }).theme, theme)
  }
  for (const title of ['', '😀 𠮷', '<script>alert(1)</script>']) {
    const scene = contentIllustration({ ...article, title, summary: '', bodyMarkdown: null })
    assert.ok(Number.isInteger(scene.seed))
    assert.ok(scene.seed >= 0 && scene.seed <= 0xffffffff)
    assert.ok(['sea', 'night', 'room', 'garden', 'city'].includes(scene.theme))
    assert.deepEqual(contentIllustration({ ...article, title, summary: '', bodyMarkdown: null }), scene)
  }
})
