/** Published metadata against actual disposable HTTP/DB and production Next. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'

assert.equal(process.env.RAYCHI_E2E_CONFIRM_ISOLATED, '1')
const credentials = JSON.parse(readFileSync(process.env.RAYCHI_RELATED_E2E_CREDENTIALS, 'utf8'))
const { chromium } = await import(pathToFileURL(process.env.RAYCHI_E2E_PLAYWRIGHT).href)
const browser = await chromium.launch(process.platform === 'darwin' ? { channel: 'chrome' } : {})
const owner = await browser.newContext({ ignoreHTTPSErrors: true })
const visitor = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 } })
const api = process.env.RAYCHI_E2E_API ?? credentials.api
const site = process.env.RAYCHI_E2E_SITE ?? credentials.site
const faultSite = process.env.RAYCHI_RELATED_E2E_FAILURE_SITE
const ids = []
let csrf
async function req(path, method = 'GET', data, expected = 200) {
  const response = await owner.request.fetch(api + path, { method,
    headers: csrf ? { [csrf.headerName]: csrf.token } : {}, ...(data === undefined ? {} : { data }) })
  assert.equal(response.status(), expected, `${method} ${path}`)
  return expected === 204 ? undefined : response.json()
}
async function publish(type, title, tags, category, prefix = 'related-') {
  let item = await req('/api/v1/admin/contents?type=' + type, 'POST', {}, 201)
  ids.push(item.id)
  item = await req('/api/v1/admin/contents/' + item.id, 'PUT', { version: item.version,
    slug: type === 'ARTICLE' ? prefix + randomUUID() : item.slug,
    title, summary: title + '摘要', bodyMarkdown: '# ' + title + '\n\n可公开阅读的正文。',
    tags, category, publicationMetadata: true })
  return req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: item.version, metadataReviewed: true })
}
try {
  csrf = await req('/api/v1/auth/csrf')
  await req('/api/v1/auth/login', 'POST', { username: credentials.username, password: credentials.password })
  csrf = await req('/api/v1/auth/csrf')
  const namespace = randomUUID().slice(0, 8)
  const category = '相关文章-' + namespace
  await req('/api/v1/admin/categories', 'POST', { name: category }, 200)
  const tag = namespace + '-中文'
  const target = await publish('ARTICLE', '推荐目标', [tag, namespace + '-Case'], category)
  let best = await publish('ARTICLE', '共享双标签', [tag, namespace + '-Case'], category)
  const next = await publish('ARTICLE', '共享单标签', [tag], '未分类')
  const last = await publish('ARTICLE', '同分类', [namespace + '-case'], category)
  await publish('ARTICLE', '大小写不匹配', [namespace + '-case'], '未分类')
  const post = await publish('POST', '排除帖子', [tag], null)
  const empty = await publish('ARTICLE', '无相关内容', [], '未分类')
  const timeout = await publish('ARTICLE', '超时仍可阅读', [tag], '未分类', 'related-timeout-')
  const path = `/api/v1/public/contents/ARTICLE/${target.slug}/related`
  // Isolate the timeout fixture before scoring normal recommendations.
  await req(`/api/v1/admin/contents/${timeout.id}/unpublish`, 'POST', { expectedVersion: timeout.version })
  const page = await visitor.newPage()
  await page.goto(site + '/writing/' + target.slug)
  const section = page.getByRole('region', { name: '相关文章' })
  await section.waitFor()
  assert.deepEqual(await section.locator('h3').allTextContents(), ['共享双标签', '共享单标签', '同分类'])
  assert.deepEqual((await req(path)).map(item => item.id), [best.id, next.id, last.id])
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  if (process.env.RAYCHI_RELATED_E2E_SCREENSHOT) await section.screenshot({ path: process.env.RAYCHI_RELATED_E2E_SCREENSHOT })
  await section.getByRole('link').nth(1).focus()
  await page.keyboard.press('Enter')
  await page.waitForURL(site + '/writing/' + next.slug)
  assert.equal(await page.locator('.article-heading h1').textContent(), '共享单标签')
  best = await req('/api/v1/admin/contents/' + best.id, 'PUT', { version: best.version, slug: best.slug,
    title: '私有标题', summary: '私有摘要', bodyMarkdown: '# 私有标题\n\n工作稿。', tags: [], category: '未分类', publicationMetadata: true })
  await page.goto(site + '/writing/' + target.slug)
  assert.deepEqual(await section.locator('h3').allTextContents(), ['共享双标签', '共享单标签', '同分类'])
  best = await req(`/api/v1/admin/contents/${best.id}/publish`, 'POST', { expectedVersion: best.version, metadataReviewed: true })
  await page.reload()
  assert.deepEqual(await section.locator('h3').allTextContents(), ['共享单标签', '同分类'])
  await req(`/api/v1/admin/contents/${next.id}/unpublish`, 'POST', { expectedVersion: next.version })
  await page.reload()
  assert.deepEqual(await section.locator('h3').allTextContents(), ['同分类'])
  await page.goto(site + '/writing/' + empty.slug)
  assert.equal(await section.count(), 0)
  await page.goto(site + '/posts/' + post.slug)
  assert.equal(await section.count(), 0)
  assert.ok(faultSite, 'actual server-side failure fixture is required')
  for (const item of [target, timeout]) {
    if (item.id === timeout.id) {
      const current = await req('/api/v1/admin/contents/' + item.id)
      await req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: current.version, metadataReviewed: true })
    }
    const start = Date.now()
    assert.equal((await page.goto(faultSite + '/writing/' + item.slug)).status(), 200)
    assert.equal(await page.locator('article.prose').innerText(), item.title + '\n\n可公开阅读的正文。')
    assert.equal(await section.count(), 0)
    assert.ok(Date.now() - start < 3500, 'optional recommendations have a bounded timeout')
  }
  await req(`/api/v1/admin/contents/${target.id}/unpublish`, 'POST', { expectedVersion: target.version })
  assert.equal((await page.goto(site + '/writing/' + target.slug)).status(), 404)
  assert.equal(await section.count(), 0)
  console.log('PASS related articles: actual weighted published metadata, exact-case/no-default fallback, exclusion, draft/republish/withdrawal, native keyboard links, 390px, actual 503 and 4s upstream deadline still render reading')
} finally {
  for (const id of ids) {
    const current = await req('/api/v1/admin/contents/' + id).catch(() => null)
    if (current) await req(`/api/v1/admin/contents/${id}?expectedVersion=${current.version}`, 'DELETE', undefined, 204)
  }
  await browser.close()
}
