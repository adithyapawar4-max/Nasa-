// Header normalization: makes spreadsheet headers canonical before mapping.
// All comparisons are case-insensitive and ignore punctuation/spacing.

export function normalizeHeaderKey(header: string): string {
  return String(header ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function normalizeHeaderKeys(headers: readonly string[]): string[] {
  return headers.map((h, i) => {
    const key = normalizeHeaderKey(h)
    return key || `column_${i + 1}`
  })
}