import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import { articleRemarkPlugins, articleRehypePlugins } from '../src/features/contents/article-markdown.ts'

function render(source) {
  return renderToStaticMarkup(createElement(Markdown, {
    remarkPlugins: articleRemarkPlugins,
    rehypePlugins: articleRehypePlugins,
    children: source,
  }))
}

test('server rendering supports inline and block TeX, retaining code literals', () => {
  const html = render('行内 $E=mc^2$。\n\n$$\n\\frac{1}{2} + \\sqrt{x}\n$$\n\n`$literal$`\n\n```tex\n$notMath$\n```')
  assert.equal((html.match(/class="katex"/g) ?? []).length, 2)
  assert.match(html, /class="katex-display"/)
  assert.match(html, /<math xmlns="http:\/\/www.w3.org\/1998\/Math\/MathML"/)
  assert.match(html, /<code>\$literal\$<\/code>/)
  assert.match(html, /<code class="language-tex">\$notMath\$/)
})

test('invalid and over-budget math is readable and does not abort the article', () => {
  const html = render('前文\n\n$\\frac{x}{$\n\n$\\def\\recur{\\recur}\\recur$\n\n后文')
  assert.equal((html.match(/class="katex-error"/g) ?? []).length, 2)
  assert.match(html, /\\frac\{x\}\{/)
  assert.match(html, /后文/)
})

test('untrusted TeX cannot create links, images, classes or execute HTML', () => {
  const html = render('$\\href{javascript:alert(1)}{click}$\n\n$\\includegraphics{https://evil.invalid/track.png}$\n\n$\\htmlClass{attacker}{x}$\n\n<script>alert(1)</script>')
  assert.doesNotMatch(html, /<a\b|<img\b|<script\b|class="attacker"/)
  // A polluted ambient prototype must not turn trust:false into a trusted URL.
  Object.defineProperty(Object.prototype, 'trust', { value: true, configurable: true, writable: true })
  Object.defineProperty(Object.prototype, 'protocol', { value: 'https', configurable: true, writable: true })
  try {
    const polluted = render('$\\href{javascript:alert(1)}{click}$')
    assert.doesNotMatch(polluted, /<a\b/)
  } finally {
    delete Object.prototype.trust
    delete Object.prototype.protocol
  }
})
