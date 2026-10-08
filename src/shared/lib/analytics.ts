const preferenceKey = 'raychi.analytics.disabled'
let disabledInMemory = false

export function analyticsDisabled() {
  try {
    return localStorage.getItem(preferenceKey) === 'true'
  } catch {
    return disabledInMemory
  }
}

export function setAnalyticsDisabled(disabled: boolean) {
  disabledInMemory = disabled
  try {
    localStorage.setItem(preferenceKey, String(disabled))
  } catch {
    /* The current tab still honours the setting without storage. */
  }
  window.dispatchEvent(new Event('raychi-analytics-preference'))
}

export function browserOptedOut() {
  return (
    analyticsDisabled() ||
    navigator.doNotTrack === '1' ||
    (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  )
}

function dailyVisitor(): string | undefined {
  try {
    const key = 'raychi.analytics.visitor'
    const day = new Date().toISOString().slice(0, 10)
    const previous = JSON.parse(sessionStorage.getItem(key) ?? 'null') as {
      day?: string
      id?: string
    } | null
    if (previous?.day === day && /^[0-9a-f-]{36}$/.test(previous.id ?? '')) return previous!.id
    const id = crypto.randomUUID()
    sessionStorage.setItem(key, JSON.stringify({ day, id }))
    return id
  } catch {
    return undefined
  }
}

export async function collectPageView(path: string) {
  if (browserOptedOut()) return
  try {
    const event: {
      id: string
      path: string
      occurredAt: string
      visitorId?: string
      source?: string
    } = {
      id: crypto.randomUUID(),
      path,
      occurredAt: new Date().toISOString(),
      visitorId: dailyVisitor(),
    }
    if (document.referrer) {
      const source = new URL(document.referrer).hostname.toLowerCase()
      if (
        source !== location.hostname &&
        /^[a-z0-9][a-z0-9.-]*$/.test(source) &&
        !/^[0-9.]+$/.test(source)
      )
        event.source = source
    }
    const csrfResponse = await fetch('/api/v1/auth/csrf', {
      credentials: 'same-origin',
      cache: 'no-store',
      signal: AbortSignal.timeout(1500),
    })
    if (!csrfResponse.ok || browserOptedOut()) return
    const csrf = (await csrfResponse.json()) as { token: string; headerName: string }
    await fetch('/api/v1/public/analytics/events', {
      method: 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', [csrf.headerName]: csrf.token },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(2000),
    })
  } catch {
    /* Analytics never interrupts reading or displays a business error. */
  }
}
