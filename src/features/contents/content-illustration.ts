import type { PublicContent } from './types'

type IllustrationContent = Pick<
  PublicContent,
  'id' | 'title' | 'summary' | 'bodyMarkdown' | 'category' | 'tags'
>

const palettes = [
  {
    paper: '#eeeadd',
    sky: '#c1ced0',
    far: '#93adb5',
    near: '#668693',
    ink: '#293f53',
    sun: '#e5c65f',
  },
  {
    paper: '#f1ecdf',
    sky: '#c8d0cb',
    far: '#a6b3a7',
    near: '#748e87',
    ink: '#304853',
    sun: '#e9ca66',
  },
  {
    paper: '#eee8dc',
    sky: '#bbc7cd',
    far: '#9caab6',
    near: '#758c9e',
    ink: '#2c3e56',
    sun: '#e5c35a',
  },
] as const

const themes = [
  { name: 'sea', words: /海|潮|航|岛|沙滩|ocean|sea\b|coast|island/gi },
  { name: 'night', words: /夜|月|星|梦|睡|night|moon|star|dream/gi },
  {
    name: 'room',
    words: /书|阅读|写作|工作|代码|编程|技术|电脑|咖啡|read|book|code|software|coffee/gi,
  },
  { name: 'garden', words: /花|树|森林|春|秋|山|自然|garden|forest|flower|mountain/gi },
  { name: 'city', words: /城市|街|路|旅行|车|雨|city|street|travel|train|rain/gi },
] as const

// FNV-1a followed by a seeded PRNG: no clocks, network calls or Math.random.
function hash(text: string): number {
  let value = 2166136261
  for (const character of text) {
    value = Math.imul(value ^ character.codePointAt(0)!, 16777619)
  }
  return value >>> 0
}

function randomFrom(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), state | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function contentIllustration(content: IllustrationContent) {
  const normalize = (value: string | null) =>
    (value ?? '').normalize('NFKC').replace(/\s+/g, ' ').trim()
  const text = [
    content.title,
    content.summary,
    content.category,
    ...content.tags,
    content.bodyMarkdown,
  ]
    .map(normalize)
    .join('\n')
  const seed = hash(JSON.stringify([content.id, text]))
  const random = randomFrom(seed)
  const between = (min: number, max: number) => Math.round(min + random() * (max - min))
  const scored = themes.map((theme) => ({
    name: theme.name,
    score: (text.match(theme.words) ?? []).length,
  }))
  const highest = Math.max(...scored.map((theme) => theme.score))
  const candidates = highest ? scored.filter((theme) => theme.score === highest) : scored
  const theme = candidates[between(0, candidates.length - 1)].name
  return {
    seed,
    theme,
    palette: palettes[between(0, palettes.length - 1)],
    flipped: random() > 0.5,
    sun: { x: between(355, 550), y: between(55, 110), r: between(17, 29) },
    horizon: between(192, 224),
    peak: { x: between(270, 430), y: between(128, 174) },
    person: { x: between(245, 285), y: between(244, 275) },
    clouds: Array.from({ length: between(2, 4) }, () => ({
      x: between(70, 470),
      y: between(44, 135),
      width: between(55, 115),
      height: between(8, 16),
    })),
    plants: Array.from({ length: between(4, 7) }, () => ({
      x: between(390, 615),
      height: between(38, 90),
      lean: between(-18, 18),
    })),
    buildings: Array.from({ length: 7 }, (_, index) => ({
      x: 35 + index * 85,
      width: between(42, 72),
      height: between(35, 100),
    })),
    stars: Array.from({ length: between(6, 12) }, () => ({
      x: between(50, 585),
      y: between(28, 160),
      r: between(1, 3),
    })),
  }
}
