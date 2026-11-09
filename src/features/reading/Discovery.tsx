import Link from 'next/link'
import { EmptyState } from '@/shared/ui/EmptyState'
import type { DiscoveryEntry, DiscoveryPage } from './types'

const date = (value: string) =>
  new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
const href = (query: Record<string, string>) => '/reading?' + new URLSearchParams(query)

function Entries({ items }: { items: DiscoveryEntry[] }) {
  return (
    <div className="discovery-grid">
      {items.map((item, index) => (
        <article className="discovery-entry" key={item.id} id={'item-' + item.id}>
          <div className="discovery-meta">
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.publishedAt && <time dateTime={item.publishedAt}>{date(item.publishedAt)}</time>}
            {item.sourceCount > 1 && <span>{item.sourceCount} 个来源</span>}
          </div>
          <h3>{item.title}</h3>
          {item.summary && <p className="discovery-summary">{item.summary}</p>}
          {item.sources.length === 1 ? (
            <a
              className="discovery-original"
              href={item.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.sources[0].name || '原文'}
            </a>
          ) : item.sources.length > 1 ? (
            <details className="discovery-sources">
              <summary>查看原文来源（{item.sources.length}）</summary>
              <ul>
                {item.sources.map((source, i) => (
                  <li key={source.url + i}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <span>{source.name || '原文'}</span> {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export function Discovery({ data }: { data: DiscoveryPage }) {
  const report = data.report
  return (
    <>
      <nav className="discovery-tabs" aria-label="拾阅内容">
        {(
          [
            ['hot', '热榜'],
            ['latest', '最新'],
            ['reports', '汇总'],
          ] as const
        ).map(([view, label]) => (
          <Link
            key={view}
            href={href({ view })}
            aria-current={data.view === view ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {data.view === 'reports' && (
        <div className="discovery-report-controls">
          <nav className="discovery-periods" aria-label="汇总周期">
            {(
              [
                ['daily', '日刊'],
                ['weekly', '周刊'],
                ['monthly', '月刊'],
              ] as const
            ).map(([period, label]) => (
              <Link
                key={period}
                href={href({ view: 'reports', period })}
                aria-current={data.period === period ? 'page' : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          {data.issues.length > 0 && (
            <form action={`${process.env.RAYCHI_BASE_PATH ?? ''}/reading`}>
              <input type="hidden" name="view" value="reports" />
              <input type="hidden" name="period" value={data.period} />
              <label htmlFor="reading-issue" className="sr-only">
                历史期数
              </label>
              <select id="reading-issue" name="key" defaultValue={data.key}>
                <option value="latest">最新一期</option>
                {data.issues.map((issue) => (
                  <option key={issue.key} value={issue.key}>
                    {issue.key}
                  </option>
                ))}
              </select>
              <button type="submit">查看</button>
            </form>
          )}
        </div>
      )}
      {!data.available ? (
        <div role="status">
          <EmptyState>暂时无法加载拾阅，请稍后刷新。</EmptyState>
          <a
            href={`${process.env.RAYCHI_BASE_PATH ?? ''}${href({
              view: data.view,
              ...(data.view === 'reports' ? { period: data.period, key: data.key } : {}),
            })}`}
          >
            重试
          </a>
        </div>
      ) : (
        <>
          {data.stale && (
            <p role="status" className="reading-note-status">
              暂时无法更新，先展示最近的内容。
            </p>
          )}
          {data.view === 'reports' ? (
            report ? (
              <div className="discovery-report">
                <header className="discovery-report-heading">
                  <p>
                    {report.key}
                    {report.generatedAt && (
                      <time dateTime={report.generatedAt}> · {date(report.generatedAt)}</time>
                    )}
                  </p>
                  {report.title && <h2>{report.title}</h2>}
                  {report.intro && <p>{report.intro}</p>}
                </header>
                {report.sections.map((section, i) => (
                  <section className="discovery-section" key={section.label + i}>
                    <h2>{section.label}</h2>
                    {section.summary && <p>{section.summary}</p>}
                    <Entries items={section.items} />
                  </section>
                ))}
                {report.sections.every((section) => section.items.length === 0) && (
                  <EmptyState>这一期暂时没有内容。</EmptyState>
                )}
              </div>
            ) : (
              <EmptyState>这一期汇总尚未发布。</EmptyState>
            )
          ) : data.items.length ? (
            <Entries items={data.items} />
          ) : (
            <EmptyState>还没有新内容，过会儿再来看看。</EmptyState>
          )}
          {data.nextCursor && (
            <Link
              className="discovery-next"
              href={href({ view: 'latest', cursor: data.nextCursor })}
            >
              查看更多
            </Link>
          )}
        </>
      )}
    </>
  )
}
