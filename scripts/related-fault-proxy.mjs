/** Disposable test proxy only. Never installed in a production runtime. */
import assert from 'node:assert/strict'
import http from 'node:http'

assert.equal(process.env.RAYCHI_E2E_CONFIRM_ISOLATED, '1')
const upstream = new URL(process.env.RAYCHI_RELATED_PROXY_API)
assert.equal(upstream.protocol, 'http:')
const server = http.createServer((req, res) => {
  if (req.url.includes('/related?')) {
    const send = () => { res.writeHead(503); res.end('disposable recommendation outage') }
    if (req.url.includes('related-timeout-')) setTimeout(send, 4000)
    else send()
    return
  }
  const forwarded = http.request(new URL(req.url, upstream), { method: req.method, headers: req.headers }, response => {
    res.writeHead(response.statusCode, response.headers)
    response.pipe(res)
  })
  forwarded.on('error', () => { res.writeHead(502); res.end() })
  req.pipe(forwarded)
})
server.listen(Number(process.env.RAYCHI_RELATED_PROXY_PORT ?? 18095), process.env.RAYCHI_RELATED_PROXY_HOST ?? '127.0.0.1')
