'use client'

import { useEffect, useState } from 'react'
import { analyticsDisabled, browserOptedOut, setAnalyticsDisabled } from '../lib/analytics'

export function AnalyticsPreference() {
  const [disabled, setDisabled] = useState(false)
  const [browserPrivacy, setBrowserPrivacy] = useState(false)
  useEffect(() => {
    const update = () => {
      setDisabled(analyticsDisabled())
      setBrowserPrivacy(
        navigator.doNotTrack === '1' ||
          (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl ===
            true,
      )
    }
    update()
    window.addEventListener('storage', update)
    window.addEventListener('raychi-analytics-preference', update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener('raychi-analytics-preference', update)
    }
  }, [])
  return (
    <button
      type="button"
      className="analytics-preference"
      aria-pressed={disabled || browserPrivacy}
      disabled={browserPrivacy}
      title="仅统计公开页面路径及来源主机名，不采集全文、查询词或原始 IP。"
      onClick={() => {
        setAnalyticsDisabled(!disabled)
        setDisabled(browserOptedOut())
      }}
    >
      {browserPrivacy
        ? '已遵循浏览器隐私偏好'
        : disabled
          ? '访问统计已关闭 · 开启'
          : '关闭访问统计'}
    </button>
  )
}
