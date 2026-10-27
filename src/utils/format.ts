export function formatNumber(value: number | null | undefined, unit?: string | null): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  const text = Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '')
  return unit ? `${text} ${unit}` : text
}

export function formatRelativeTime(date: Date | null): string {
  if (!date) return 'never'
  const diff = Date.now() - date.getTime()
  const sec = Math.round(diff / 1000)
  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  return `${hr}h ago`
}

export function isValidUrl(value: string | null): value is string {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
