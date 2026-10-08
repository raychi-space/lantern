/** Actual public Markdown on a disposable DB; no production or paid-model calls. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { pathToFileURL } from 'node:url'

assert.equal(process.env.RAYCHI_E2E_CONFIRM_ISOLATED, '1')
const credentials = JSON.parse(readFileSync(process.env.RAYCHI_READING_E2E_CREDENTIALS, 'utf8'))
const { chromium } = await import(pathToFileURL(process.env.RAYCHI_E2E_PLAYWRIGHT).href)
const browser = await chromium.launch(process.platform === 'darwin' ? { channel: 'chrome' } : {})
const owner = await browser.newContext({ ignoreHTTPSErrors: true })
const visitor = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/154.0.0.0 Safari/537.36' })
const site = process.env.RAYCHI_E2E_SITE ?? credentials.site
const api = process.env.RAYCHI_E2E_API ?? credentials.api
const ids = []
let csrf
async function req(path, method = 'GET', data, expected = 200) {
  const response = await owner.request.fetch(api + path, { method,
    headers: csrf ? { [csrf.headerName]: csrf.token } : {}, ...(data === undefined ? {} : { data }) })
  assert.equal(response.status(), expected, `${method} ${path}`)
  return expected === 204 ? undefined : response.json()
}
async function article(body) {
  let item = await req('/api/v1/admin/contents?type=ARTICLE', 'POST', {}, 201)
  ids.push(item.id)
  item = await req(`/api/v1/admin/contents/${item.id}`, 'PUT', { version: item.version,
    slug: 'outline-' + randomUUID(), title: '', bodyMarkdown: body, category: '未分类', tags: [] })
  return req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: item.version, metadataReviewed: true })
}
try {
  csrf = await req('/api/v1/auth/csrf')
  await req('/api/v1/auth/login', 'POST', { username: credentials.username, password: credentials.password })
  csrf = await req('/api/v1/auth/csrf')
  let item = await article('# 目录验收\n\n## **中文** [链接](https://example.com) `代码`\n\n```md\n## 不是标题\n```\n\n> ## 引用内标题\n\n## 重复\n\n' + '正文用于验证滚动。\n\n'.repeat(35) + '### 重复\n\nSetext章节\n----\n\n#### 子节\n\n##### 深层章节\n\n<div>\n## 原始 HTML 不算标题\n</div>\n\n' + '页尾正文。\n\n'.repeat(35))
  const short = await article('# 短文\n\n正文，无章节目录。')
  const day = new Date().toISOString().slice(0, 10)
  const end = new Date(Date.parse(day + 'T00:00:00Z') + 86400000).toISOString().slice(0, 10)
  const reportPath = `/api/v1/admin/analytics/report?from=${day}&to=${end}`
  const baseline = (await req(reportPath)).pageViews
  const page = await visitor.newPage()
  let events = 0
  page.on('request', request => { if (request.url().includes('/public/analytics/events')) events++ })
  const collected = page.waitForRequest(request => request.url().includes('/public/analytics/events'))
  await page.goto(site + '/writing/' + item.slug)
  const toc = page.getByRole('navigation', { name: '文章目录' })
  await toc.waitFor()
  assert.deepEqual(await toc.locator('a').allTextContents(), ['中文 链接 代码', '重复', '重复', 'Setext章节', '子节'])
  const hrefs = await toc.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')))
  assert.equal(new Set(hrefs).size, hrefs.length)
  for (const href of hrefs) assert.equal(await page.locator('article.prose').locator(href).count(), 1)
  await collected
  assert.equal(events, 1)
  const before = events
  if (process.env.RAYCHI_READING_E2E_SCREENSHOT) await toc.screenshot({ path: process.env.RAYCHI_READING_E2E_SCREENSHOT })
  await toc.getByRole('link', { name: '重复', exact: true }).nth(1).focus()
  await page.keyboard.press('Enter')
  assert.equal(new URL(page.url()).hash, '#reading-section-5')
  assert.ok((await page.locator('#reading-section-5').boundingBox()).y >= 80, 'heading is not covered by navigation')
  await page.waitForTimeout(350)
  assert.equal(events, before, 'hash navigation does not emit another page view')
  const count = (await req(reportPath)).pageViews
  assert.equal(count, baseline + 1)
  await toc.locator('summary').focus()
  await page.keyboard.press('Enter')
  assert.equal(await toc.locator('details').getAttribute('open'), null)
  await page.keyboard.press('Enter')
  assert.equal(await toc.locator('details').getAttribute('open'), '')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  // Working draft headings cannot alter the public outline until explicit publish.
  item = await req(`/api/v1/admin/contents/${item.id}`, 'PUT', { version: item.version,
    slug: item.slug, title: '', bodyMarkdown: '# 新版本\n\n## 新章节一\n\n## 新章节二', category: item.category, tags: [] })
  await page.reload()
  assert.equal(await toc.getByRole('link', { name: '新章节一' }).count(), 0)
  assert.equal(await toc.getByRole('link', { name: '重复', exact: true }).count(), 2)
  item = await req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: item.version, metadataReviewed: true })
  await page.goto(site + '/writing/' + item.slug)
  assert.deepEqual(await toc.locator('a').allTextContents(), ['新章节一', '新章节二'])
  await page.goto(site + '/writing/' + short.slug)
  assert.equal(await page.getByRole('navigation', { name: '文章目录' }).count(), 0)
  await req(`/api/v1/admin/contents/${item.id}/unpublish`, 'POST', { expectedVersion: item.version })
  assert.equal((await page.goto(site + '/writing/' + item.slug)).status(), 404)
  assert.equal(await page.getByRole('navigation', { name: '文章目录' }).count(), 0)
  console.log('PASS article outline: GFM/rendered anchors, duplicates, code/raw HTML exclusion, keyboard/hash navigation, no extra PV, 390px, draft isolation/republish, short text, withdrawal')
} finally {
  for (const id of ids) {
    const current = await req('/api/v1/admin/contents/' + id).catch(() => null)
    if (current) await req(`/api/v1/admin/contents/${id}?expectedVersion=${current.version}`, 'DELETE', undefined, 204)
  }
  await browser.close()
}
