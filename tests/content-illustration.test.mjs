import test from 'node:test'
import assert from 'node:assert/strict'
import { contentIllustration } from '../src/features/contents/content-illustration.ts'
import { illustrationSubjects, illustrationWeathers, illustrationTimes } from '../src/features/contents/illustration-catalog.ts'

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

test('content keywords select all subjects and unusual text is safe', () => {
  for (const subject of illustrationSubjects) {
    assert.equal(contentIllustration({ ...article, title: subject.title, summary: '', bodyMarkdown: subject.body }).theme, subject.id)
  }
  for (const title of ['', '😀 𠮷', '<script>alert(1)</script>']) {
    const scene = contentIllustration({ ...article, title, summary: '', bodyMarkdown: null })
    assert.ok(Number.isInteger(scene.seed))
    assert.ok(scene.seed >= 0 && scene.seed <= 0xffffffff)
    assert.ok(illustrationSubjects.some((subject) => subject.id === scene.theme))
    assert.deepEqual(contentIllustration({ ...article, title, summary: '', bodyMarkdown: null }), scene)
  }
})

test('weather and time are inferred independently of the subject', () => {
  for (const weather of illustrationWeathers) {
    for (const time of illustrationTimes) {
      const scene = contentIllustration({ ...article, title: `高楼 ${weather.name} ${time.name}`, summary: '', bodyMarkdown: null })
      assert.equal(scene.theme, 'skyscrapers')
      assert.equal(scene.weather, weather.id)
      assert.equal(scene.time, time.id)
    }
  }
})

test('preview options support every combination without affecting article generation', () => {
  const original = contentIllustration(article)
  const seeds = new Set()
  for (const subject of illustrationSubjects) {
    for (const weather of illustrationWeathers) {
      for (const time of illustrationTimes) {
        const options = { subject: subject.id, weather: weather.id, time: time.id }
        const scene = contentIllustration(article, options)
        assert.deepEqual(contentIllustration(article, options), scene)
        assert.equal(scene.theme, subject.id)
        assert.equal(scene.weather, weather.id)
        assert.equal(scene.time, time.id)
        assert.ok(!('person' in scene))
        seeds.add(scene.seed)
      }
    }
  }
  assert.equal(seeds.size, 18 * 6 * 3)
  assert.deepEqual(contentIllustration(article), original)
})
