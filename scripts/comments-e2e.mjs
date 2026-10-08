/** Disposable content DB and locally intercepted giscus only; no GitHub writes. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'

assert.equal(process.env.RAYCHI_E2E_CONFIRM_ISOLATED, '1')
const credentials = JSON.parse(readFileSync(process.env.RAYCHI_COMMENTS_E2E_CREDENTIALS, 'utf8'))
const { chromium } = await import(pathToFileURL(process.env.RAYCHI_E2E_PLAYWRIGHT).href)
const browser = await chromium.launch(process.platform === 'darwin' ? { channel: 'chrome' } : {})
const context = await browser.newContext({ ignoreHTTPSErrors: true, viewport: { width: 390, height: 844 } })
const owner = await browser.newContext({ ignoreHTTPSErrors: true })
const site = process.env.RAYCHI_COMMENTS_E2E_SITE
const api = process.env.RAYCHI_E2E_API ?? credentials.api
let csrf
const ids = []
async function req(path, method = 'GET', data, expected = 200) {
  const response = await owner.request.fetch(api + path, {
    method, headers: csrf ? { [csrf.headerName]: csrf.token } : {},
    ...(data === undefined ? {} : { data }),
  })
  assert.equal(response.status(), expected, `${method} ${path}`)
  return expected === 204 ? undefined : response.json()
}
let mode = 'ready'
let thirdParty = 0
let lastParams
await context.route('https://giscus.app/**', async route => {
  thirdParty++
  lastParams = new URL(route.request().url()).searchParams
  if (mode === 'blocked') return route.abort()
  // The official component itself is real. Only GitHub-backed iframe content
  // is substituted, including the documented resize and configuration protocol.
  await route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><body><p>评论测试</p><script>
    window.addEventListener('message', event => { window.lastConfig = event.data.giscus?.setConfig; });
    parent.postMessage({giscus:{error:'Discussion not found'}}, '*');
    parent.postMessage({giscus:{resizeHeight:240}}, '*');
  </script></body></html>` })
})
try {
  csrf = await req('/api/v1/auth/csrf')
  await req('/api/v1/auth/login', 'POST', { username: credentials.username, password: credentials.password })
  csrf = await req('/api/v1/auth/csrf')
  const items = []
  for (const type of ['ARTICLE', 'POST']) {
    let item = await req(`/api/v1/admin/contents?type=${type}`, 'POST', {}, 201)
    ids.push(item.id)
    item = await req(`/api/v1/admin/contents/${item.id}`, 'PUT', {
      version: item.version, slug: type === 'POST' ? item.slug : 'comments-' + randomUUID(), title: '评论本地验收',
      bodyMarkdown: '# 评论本地验收\n\n公开正文。', category: type === 'POST' ? null : '未分类', tags: [],
    })
    item = await req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: item.version, metadataReviewed: true })
    items.push(item)
  }
  const path = item => `/${item.type === 'ARTICLE' ? 'writing' : 'posts'}/${item.slug}`
  const page = await context.newPage()
  await page.goto(site + path(items[0]))
  await page.getByRole('button', { name: '加载 GitHub 评论' }).waitFor()
  assert.equal(thirdParty, 0, 'no third-party request before opt-in')
  await page.getByRole('button', { name: '加载 GitHub 评论' }).click()
  await page.locator('giscus-widget').waitFor()
  await page.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  assert.equal(await page.locator('.github-comments [role=alert]').count(), 0, 'new discussion is not a failure')
  assert.equal(lastParams.get('term'), `raychi-content:${items[0].id}`)
  assert.equal(lastParams.get('strict'), '1')
  assert.equal(lastParams.get('repo'), 'raychi-space/comments-fixture')
  assert.equal(lastParams.get('categoryId'), 'DIC_fixture')
  assert.equal(thirdParty, 1)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  const frame = page.frames().find(frame => frame.url().startsWith('https://giscus.app/'))
  assert.ok(frame)
  const requestsBeforeTheme = thirdParty
  await page.getByRole('button', { name: '切换到浅色纸张主题' }).click()
  await frame.waitForFunction(() => window.lastConfig?.theme === 'light')
  assert.equal(thirdParty, requestsBeforeTheme, 'theme does not reload comments')
  // Same origin alone is insufficient: an unrelated sender cannot control UI.
  await page.evaluate(() => window.dispatchEvent(new MessageEvent('message', {
    origin: 'https://giscus.app', source: window, data: { giscus: { error: 'fake' } },
  })))
  assert.equal(await page.locator('.github-comments [role=alert]').count(), 0)
  await frame.evaluate(() => parent.postMessage({ giscus: { error: 'API rate limit exceeded' } }, '*'))
  await page.getByRole('alert').filter({ hasText: '评论暂时无法加载' }).waitFor()
  assert.equal(await page.locator('giscus-widget').count(), 0)
  await page.getByRole('button', { name: '重试加载评论' }).click()
  await page.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  assert.equal(await page.locator('giscus-widget').count(), 1)
  // Refresh after title changes keeps the content identity mapping.
  let item = await req('/api/v1/admin/contents/' + items[0].id)
  item = await req(`/api/v1/admin/contents/${item.id}`, 'PUT', {
    version: item.version, slug: item.slug, title: '改标题后评论仍关联',
    bodyMarkdown: '# 改标题后评论仍关联\n\n新正文。', category: item.category, tags: item.tags,
  })
  item = await req(`/api/v1/admin/contents/${item.id}/publish`, 'POST', { expectedVersion: item.version, metadataReviewed: true })
  await page.reload()
  await page.getByRole('button', { name: '加载 GitHub 评论' }).click()
  await page.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  assert.equal(lastParams.get('term'), `raychi-content:${item.id}`)
  await page.getByRole('link', { name: '← 返回文章' }).click()
  await page.waitForURL(site + '/writing')
  assert.equal(await page.locator('giscus-widget').count(), 0)
  assert.equal(await page.getByRole('button', { name: '加载 GitHub 评论' }).count(), 0)
  await page.goto(site + path(items[1]))
  await page.getByRole('button', { name: '加载 GitHub 评论' }).click()
  await page.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  assert.equal(lastParams.get('term'), `raychi-content:${items[1].id}`)
  mode = 'blocked'
  await page.reload()
  await page.clock.install()
  await page.getByRole('button', { name: '加载 GitHub 评论' }).click()
  await page.locator('giscus-widget').waitFor()
  await page.clock.fastForward(16000)
  await page.getByRole('alert').filter({ hasText: '评论暂时无法加载' }).waitFor()
  await page.clock.resume()
  mode = 'ready'
  await page.getByRole('button', { name: '重试加载评论' }).click()
  await page.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  const callback = await context.newPage()
  await callback.goto(site + path(items[1]) + '?giscus=local-fixture-session')
  await callback.locator('giscus-widget').waitFor()
  await callback.getByRole('status').filter({ hasText: '正在加载评论' }).waitFor({ state: 'hidden' })
  assert.equal(new URL(callback.url()).searchParams.has('giscus'), false, 'OAuth callback resumes and consumes session parameter')
  await callback.close()
  const requestsBeforeStorage = thirdParty
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError') }
  })
  await page.reload()
  await page.getByRole('button', { name: '加载 GitHub 评论' }).click()
  await page.getByRole('alert').filter({ hasText: '评论暂时无法加载' }).waitFor()
  assert.equal(thirdParty, requestsBeforeStorage, 'blocked storage does not mount a broken OAuth widget')
  await req(`/api/v1/admin/contents/${item.id}/unpublish`, 'POST', { expectedVersion: item.version })
  assert.equal((await page.goto(site + path(item))).status(), 404)
  assert.equal(await page.getByRole('button', { name: '加载 GitHub 评论' }).count(), 0)
  for (const disabled of [process.env.RAYCHI_COMMENTS_E2E_DISABLED, process.env.RAYCHI_COMMENTS_E2E_INCOMPLETE].filter(Boolean)) {
    await page.goto(disabled + path(items[1]))
    assert.equal(await page.getByRole('button', { name: '加载 GitHub 评论' }).count(), 0)
    assert.equal(await page.locator('giscus-widget').count(), 0)
  }
  console.log('PASS comments: opt-in, published article/post, strict stable mapping, theme, source checks, network timeout/retry, OAuth callback, blocked storage, navigation, withdrawal, disabled/incomplete config, 390px')
} finally {
  for (const id of ids) {
    const item = await req('/api/v1/admin/contents/' + id).catch(() => null)
    if (item) await req(`/api/v1/admin/contents/${id}?expectedVersion=${item.version}`, 'DELETE', undefined, 204)
  }
  await browser.close()
}
