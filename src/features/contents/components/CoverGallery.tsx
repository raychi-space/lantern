'use client'

import { useRef, useState, type FormEvent } from 'react'
import { GeneratedArticleCover } from './GeneratedArticleCover'
import type { PublicContent } from '../types'
import { contentIllustration } from '../content-illustration'
import {
  illustrationSubjects,
  illustrationWeathers,
  illustrationTimes,
  type IllustrationOptions,
  type IllustrationWeather,
  type IllustrationTime,
} from '../illustration-catalog'

const examples = illustrationSubjects

function previewArticle(id: string, title: string, body: string): PublicContent {
  return {
    id,
    title,
    bodyMarkdown: body,
    summary: '',
    category: '',
    tags: [],
    type: 'ARTICLE',
    slug: id,
    coverUrl: null,
    publishedAt: '2026-10-09T00:00:00Z',
    publicUpdatedAt: '2026-10-09T00:00:00Z',
  }
}

export function CoverGallery() {
  const [group, setGroup] = useState(0)
  const [filter, setFilter] = useState('全部')
  const [weather, setWeather] = useState<IllustrationWeather | 'auto'>('auto')
  const [time, setTime] = useState<IllustrationTime | 'auto'>('auto')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [custom, setCustom] = useState<{ title: string; body: string } | null>(null)
  const [selected, setSelected] = useState<{
    item: PublicContent
    options: IllustrationOptions
  } | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  function generateCustom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCustom({ title: title.trim() || '一段日常', body: body.trim() })
  }

  function open(item: PublicContent, options: IllustrationOptions) {
    setSelected({ item, options })
    dialog.current?.showModal()
  }

  function card(item: PublicContent, version: number, options: IllustrationOptions) {
    const scene = contentIllustration(item, options)
    const weatherLabel = illustrationWeathers.find((entry) => entry.id === scene.weather)!.name
    const timeLabel = illustrationTimes.find((entry) => entry.id === scene.time)!.name
    return (
      <figure className="cover-preview" key={item.id}>
        <button
          type="button"
          className="cover-preview-image"
          onClick={() => open(item, options)}
          aria-label={`查看「${item.title}」版本 ${version} 大图`}
        >
          <GeneratedArticleCover item={item} instance="gallery" options={options} />
          <span className="cover-preview-expand" aria-hidden="true">
            ↗
          </span>
        </button>
        <figcaption>
          <span>{item.title}</span>
          <small>
            {weatherLabel} · {timeLabel} · {String(version).padStart(2, '0')}
          </small>
        </figcaption>
      </figure>
    )
  }

  return (
    <div className="cover-gallery">
      <div className="cover-gallery-toolbar">
        <div className="cover-gallery-filters" aria-label="筛选场景">
          {['全部', ...examples.map((example) => example.name)].map((name) => (
            <button
              type="button"
              key={name}
              className={`chip${filter === name ? ' active' : ''}`}
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="button-link"
          onClick={() => setGroup((value) => value + 1)}
        >
          换一组 <span aria-hidden="true">↻</span>
        </button>
      </div>
      <div className="cover-gallery-selects">
        <label>
          天气
          <select
            value={weather}
            onChange={(event) => setWeather(event.target.value as IllustrationWeather | 'auto')}
          >
            <option value="auto">自动变化</option>
            {illustrationWeathers.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          时间
          <select
            value={time}
            onChange={(event) => setTime(event.target.value as IllustrationTime | 'auto')}
          >
            <option value="auto">自动变化</option>
            {illustrationTimes.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="cover-gallery-status" role="status">
        第 {group + 1} 组 · {filter === '全部' ? examples.length * 3 : 3} 幅插画 · 点击图片查看大图
      </p>
      <div className="cover-gallery-grid">
        {examples
          .filter((example) => filter === '全部' || example.name === filter)
          .flatMap((example) =>
            Array.from({ length: 3 }, (_, index) => {
              const subjectIndex = examples.findIndex((entry) => entry.id === example.id)
              return card(
                previewArticle(
                  `preview-${group}-${example.id}-${index}`,
                  example.title,
                  example.body,
                ),
                index + 1,
                {
                  subject: example.id,
                  weather:
                    weather === 'auto'
                      ? illustrationWeathers[
                          (group + subjectIndex * 3 + index) % illustrationWeathers.length
                        ].id
                      : weather,
                  time:
                    time === 'auto'
                      ? illustrationTimes[(group + index) % illustrationTimes.length].id
                      : time,
                },
              )
            }),
          )}
      </div>
      <section className="cover-gallery-custom" aria-labelledby="custom-cover-heading">
        <div>
          <p className="eyebrow">YOUR WORDS</p>
          <h2 id="custom-cover-heading">也试试你的文字</h2>
          <p>写一个标题或一段内容，看看它会变成什么风景。</p>
        </div>
        <form onSubmit={generateCustom} className="cover-gallery-form">
          <label htmlFor="cover-title">标题</label>
          <input
            id="cover-title"
            value={title}
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例如：夜里写下一封信"
          />
          <label htmlFor="cover-body">内容</label>
          <textarea
            id="cover-body"
            value={body}
            maxLength={10000}
            rows={4}
            onChange={(event) => setBody(event.target.value)}
            placeholder="写几句日常，或者粘贴一段文章……"
          />
          <button type="submit" className="button-link">
            生成三种变化 <span aria-hidden="true">↗</span>
          </button>
        </form>
      </section>
      {custom && (
        <section aria-label="你的文字生成的插画" className="cover-gallery-grid">
          {Array.from({ length: 3 }, (_, index) =>
            card(previewArticle(`custom-${group}-${index}`, custom.title, custom.body), index + 1, {
              weather: weather === 'auto' ? undefined : weather,
              time: time === 'auto' ? undefined : time,
            }),
          )}
        </section>
      )}
      <p className="cover-gallery-note">
        这里是独立的试画页面。输入内容仅在当前页面生成插画，不会保存或修改文章。
      </p>
      <dialog
        ref={dialog}
        className="cover-preview-dialog"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
        aria-labelledby="cover-dialog-title"
      >
        <div className="cover-preview-dialog-inner">
          <div className="cover-preview-dialog-heading">
            <h2 id="cover-dialog-title">{selected?.item.title}</h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              autoFocus
              aria-label="关闭大图"
            >
              关闭 ×
            </button>
          </div>
          {selected && (
            <GeneratedArticleCover
              item={selected.item}
              instance="enlarged"
              options={selected.options}
            />
          )}
        </div>
      </dialog>
    </div>
  )
}
