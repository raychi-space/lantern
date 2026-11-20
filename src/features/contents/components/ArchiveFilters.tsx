'use client'

import { useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { archiveHref, type ArchiveQuery, type ArticleFilters } from '../archive-query'

const filters = [
  { field: 'articlesCategory', label: '按分类', all: '全部分类' },
  { field: 'articlesTag', label: '按标签', all: '全部标签' },
] as const

type Filter = (typeof filters)[number]
type Options = Record<keyof ArticleFilters, string[] | null>

export function ArchiveFilters({ query, options }: { query: ArchiveQuery; options: Options }) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const dialogId = useId()
  const [filter, setFilter] = useState<Filter>(filters[0])
  const selected = query[filter.field]
  const names = options[filter.field]

  function choose(value?: string) {
    dialog.current?.close()
    if (selected !== value) {
      router.push(archiveHref({ ...query, [filter.field]: value, articlesPage: 1 }), {
        scroll: false,
      })
    }
  }

  return (
    <>
      {filters.map((option) => {
        const value = query[option.field]
        return (
          <button
            key={option.field}
            type="button"
            className={value ? 'chip archive-filter active' : 'chip archive-filter'}
            aria-label={value ? `${option.label}：${value}` : option.label}
            aria-haspopup="dialog"
            aria-controls={dialogId}
            onClick={() => {
              setFilter(option)
              dialog.current?.showModal()
            }}
          >
            <span>{value ?? option.label}</span>
          </button>
        )
      })}
      <dialog
        ref={dialog}
        id={dialogId}
        className="archive-filter-dialog"
        aria-labelledby={`${dialogId}-heading`}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        <div className="archive-filter-dialog-inner">
          <header>
            <h2 id={`${dialogId}-heading`}>{filter.label}</h2>
            <button
              className="chip"
              type="button"
              aria-label="关闭筛选"
              onClick={() => dialog.current?.close()}
              autoFocus
            >
              关闭
            </button>
          </header>
          {names === null && <p>暂时无法加载筛选选项。</p>}
          <div className="archive-filter-options">
            <button
              type="button"
              className={selected ? 'chip' : 'chip active'}
              aria-pressed={!selected}
              onClick={() => choose()}
            >
              {filter.all}
            </button>
            {names?.map((name) => (
              <button
                type="button"
                className={name === selected ? 'chip active' : 'chip'}
                aria-pressed={name === selected}
                key={name}
                onClick={() => choose(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  )
}
