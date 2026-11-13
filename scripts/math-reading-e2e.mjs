/** Production Next + disposable HTTP fixture, not a real wellspring/DB acceptance. */
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { mkdir } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

assert.ok(process.env.RAYCHI_E2E_PLAYWRIGHT, 'Provide an installed Playwright module path')
const { chromium } = await import(pathToFileURL(process.env.RAYCHI_E2E_PLAYWRIGHT).href)
const body = [
  '# 数学与阅读导航',
  '## 行内公式 $E=mc^2$',
  '正文中的 $\\frac{1}{2}+\\sqrt{x}$，代码 `$literal$` 保留原样。',
  '$$\n' + Array.from({ length: 70 }, (_, i) => `x_{${i}}`).join(' + ') + '\n$$',
  '## 重复',
  '正文用于检验滚动与目录。\n\n'.repeat(35),
  '### 重复',
  '$$\n# not a heading\n$$',
  '$\\frac{x}{$',
  '$\\href{javascript:alert(1)}{bad}$',
  '## 结论',
  '尾部正文。\n\n'.repeat(35),
].join('\n\n')
const content = {
  id: '00000000-0000-4000-8000-000000000001', slug: 'math-reading', type: 'ARTICLE',
  title: '数学与阅读导航', summary: '公式、目录与响应式阅读验收', bodyMarkdown: body,
  tags: ['数学'], coverUrl: null, category: '写作', publishedAt: '2026-11-13T00:00:00Z',
  publicUpdatedAt: '2026-11-13T00:00:00Z',
}
const settings = {
  version: 1, siteName: 'Raychi', intro: '验收专用公开站', avatarUrl: null,
  contacts: [], accounts: [], socialAccounts: [], projectIntro: '', navigation: [], homeSections: [],
  homepage: { focus: '', projects: [], recentSections: [], bottomSections: [] },
}
const events = []
const api = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://127.0.0.1').pathname
  res.setHeader('Content-Type', 'application/json')
  let result
  if (path === '/api/v1/public/settings') result = settings
  else if (path === '/api/v1/public/contents/ARTICLE/math-reading') result = content
  else if (path === '/api/v1/public/contents/ARTICLE/short') result = { ...content, slug: 'short', bodyMarkdown: '正文 $x^2$。' }
  else if (path.endsWith('/related')) result = []
  else if (path === '/api/v1/auth/csrf') result = { token: 'fixture', headerName: 'X-CSRF-TOKEN' }
  else if (path === '/api/v1/public/analytics/events' && req.method === 'POST') {
    let input = ''
    for await (const chunk of req) input += chunk
    events.push(JSON.parse(input))
    res.writeHead(204).end()
    return
  } else {
    res.writeHead(404).end('{}')
    return
  }
  res.end(JSON.stringify(result))
})
api.listen(0, '127.0.0.1')
await once(api, 'listening')
const site = 'http://127.0.0.1:15279'
const env = { ...process.env, RAYCHI_API_URL: `http://127.0.0.1:${api.address().port}`,
  RAYCHI_SITE_URL: site, RAYCHI_BASE_PATH: '', RAYCHI_BUILD_DIR: '.next', RAYCHI_GISCUS_ENABLED: 'false' }
let server, browser
async function run(command, args) {
  const child = spawn(command, args, { env, stdio: 'inherit' })
  const [code] = await once(child, 'exit')
  assert.equal(code, 0, command + ' ' + args.join(' '))
}
async function screenshot(page, name) {
  const dir = process.env.RAYCHI_READING_E2E_SCREENSHOT_DIR
  if (!dir) return
  await mkdir(dir, { recursive: true })
  await page.screenshot({ path: `${dir}/${name}.png`, fullPage: false })
}
try {
  await run('npm', ['run', 'build'])
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '15279'], { env, stdio: 'inherit' })
  let ready = false
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error('Next server exited before readiness')
    try { ready = (await fetch(site + '/writing/math-reading')).ok } catch {}
    if (ready) break
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  assert.ok(ready, 'Next production server is ready')
  browser = await chromium.launch(process.platform === 'darwin' ? { channel: 'chrome' } : {})
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  const collected = page.waitForResponse(response => response.url().includes('/analytics/events') && response.status() === 204)
  await page.goto(site + '/writing/math-reading')
  await page.evaluate(() => document.fonts.ready)
  const toc = page.getByRole('navigation', { name: '文章目录' })
  assert.deepEqual(await toc.getByRole('link').allTextContents(), ['行内公式 E=mc^2', '重复', '重复', '结论'])
  assert.equal(await toc.locator('.reading-outline-mobile').isVisible(), false)
  assert.equal(await page.locator('.prose .katex').count() >= 3, true)
  assert.equal(await page.locator('.prose .katex-error').count(), 2)
  assert.equal(await page.locator('.prose a[href^="javascript:"]').count(), 0)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.equal(await page.locator('.katex-display').first().evaluate(el => el.scrollWidth > el.clientWidth), true)
  await collected
  assert.equal(events.length, 1)
  assert.equal(events[0].path, '/writing/math-reading')
  await screenshot(page, 'desktop')
  await toc.getByRole('link', { name: '重复', exact: true }).nth(1).focus()
  await page.keyboard.press('Enter')
  await page.waitForURL(url => url.hash === '#reading-section-4')
  await page.waitForFunction(() => Math.abs(document.querySelector('#reading-section-4').getBoundingClientRect().top - 96) < 2)
  assert.equal(Math.round((await toc.boundingBox()).y), 110, 'desktop TOC remains sticky')
  await page.waitForTimeout(200)
  assert.equal(events.length, 1, 'hash navigation adds no page view')
  await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; scrollTo(0, 0) })
  await page.waitForFunction(() => scrollY === 0)
  await screenshot(page, 'desktop-dark')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => { delete document.documentElement.dataset.theme; scrollTo(0, 0) })
  assert.equal(await toc.locator('.reading-outline-desktop').isVisible(), false)
  assert.equal(await toc.locator('details').getAttribute('open'), null)
  await toc.locator('summary').focus()
  await page.keyboard.press('Enter')
  assert.equal(await toc.getByRole('link').count(), 4)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await screenshot(page, 'mobile')
  await toc.getByRole('link', { name: '结论' }).click()
  await page.waitForFunction(() => {
    const heading = document.querySelector('#reading-section-5')
    return Math.abs(heading.getBoundingClientRect().top - parseFloat(getComputedStyle(heading).scrollMarginTop)) < 2
  })
  assert.equal(await page.evaluate(() => document.querySelector('#reading-section-5').getBoundingClientRect().top > document.querySelector('.site-header').getBoundingClientRect().bottom), true, 'mobile heading stays below the two-row header')
  await toc.locator('summary').scrollIntoViewIfNeeded()
  await toc.locator('summary').press('Enter')
  assert.equal(await toc.locator('details').getAttribute('open'), null)
  assert.deepEqual(errors, [])
  await context.close()
  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } })
  const plain = await noJS.newPage()
  await plain.goto(site + '/writing/math-reading')
  assert.equal(await plain.locator('.prose .katex').count() >= 3, true, 'math is server-rendered')
  await plain.getByRole('navigation', { name: '文章目录' }).getByRole('link', { name: '结论' }).click()
  assert.equal(new URL(plain.url()).hash, '#reading-section-5')
  await plain.setViewportSize({ width: 390, height: 844 })
  await plain.goto(site + '/writing/math-reading')
  await plain.locator('.reading-outline summary').click()
  assert.equal(await plain.getByRole('navigation', { name: '文章目录' }).getByRole('link').count(), 4)
  await plain.goto(site + '/writing/short')
  assert.equal(await plain.locator('.reading-outline').count(), 0)
  assert.equal(await plain.locator('.prose .katex').count(), 1)
  await plain.goto(site + '/writing/not-found')
  assert.equal(await plain.locator('.reading-outline').count(), 0)
  await noJS.close()
  console.log('PASS production HTTP fixture: SSR math, unsafe/malformed macros, long formula local scroll, desktop sticky TOC, mobile keyboard/no-JS details, anchors, no hash PV, short article and 404')
} finally {
  await browser?.close()
  if (server && server.exitCode === null) {
    server.kill('SIGTERM')
    await once(server, 'exit')
  }
  await new Promise(resolve => api.close(resolve))
}
