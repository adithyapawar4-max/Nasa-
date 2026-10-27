import type { ExperimentRecord } from '../types/experiment'
import { normalizeRows } from '../utils/normalizeExperiment'
import type { NormalizedSheetData } from '../utils/normalizeExperiment'

export interface GoogleSheetsConfig {
  spreadsheetId: string
  range: string
  apiKey: string
}

export interface FetchResult {
  records: ExperimentRecord[]
  headers: string[]
  normalizedHeaders: string[]
  warnings: string[]
  fetchedAt: Date
}

const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 400

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function readGoogleSheetsConfig(): GoogleSheetsConfig | null {
  const spreadsheetId = import.meta.env.VITE_GOOGLE_SHEETS_ID?.trim()
  const range = import.meta.env.VITE_GOOGLE_SHEETS_RANGE?.trim()
  const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY?.trim()
  if (!spreadsheetId || !range || !apiKey) return null
  return { spreadsheetId, range, apiKey }
}

export function isGoogleSheetsConfigured(): boolean {
  return readGoogleSheetsConfig() !== null
}

// Public API wrappers.
export async function fetchExperimentRecords(
  signal?: AbortSignal,
): Promise<FetchResult> {
  const config = readGoogleSheetsConfig()
  if (!config) {
    throw new Error(
      'Google Sheets is not configured. Set VITE_GOOGLE_SHEETS_ID, VITE_GOOGLE_SHEETS_RANGE, and VITE_GOOGLE_SHEETS_API_KEY.',
    )
  }

  const encodedRange = encodeURIComponent(config.range)
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}` +
    `/values/${encodedRange}?key=${encodeURIComponent(config.apiKey)}`

  let lastError: unknown = null
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError')
    try {
      const response = await fetch(url, { signal })
      if (!response.ok) {
        let detail = response.statusText
        try {
          const body = await response.json()
          detail = body?.error?.message ?? detail
        } catch {
          /* ignore */
        }
        throw new Error(`Google Sheets request failed (${response.status}): ${detail}`)
      }
      const json = (await response.json()) as { values?: unknown[][]; error?: { message?: string } }
      if (json.error?.message) throw new Error(json.error.message)
      const values = Array.isArray(json.values) ? json.values : []
      if (values.length === 0) {
        throw new Error('Spreadsheet returned no rows.')
      }
      const [headerRow, ...dataRows] = values
      const headerStrings = (headerRow ?? []).map((cell) => String(cell ?? ''))
      const normalized: NormalizedSheetData = normalizeRows(headerStrings, dataRows as unknown[][])

      // Header sanity check.
      if (normalized.headers.length === 0) {
        throw new Error('Could not parse spreadsheet headers.')
      }

      return {
        records: normalized.records,
        headers: normalized.headers,
        normalizedHeaders: normalized.normalizedHeaders,
        warnings: normalized.warnings,
        fetchedAt: new Date(),
      }
    } catch (error) {
      lastError = error
      if (signal?.aborted) throw error
      if (error instanceof Error && /AbortError/i.test(error.name)) throw error
      const isTransient =
        !(error instanceof Response) &&
        (String(error).includes('Network') ||
          String(error).includes('Failed to fetch') ||
          (error instanceof Error && /5\d\d/.test(error.message)))
      if (!isTransient || attempt === MAX_ATTEMPTS) break
      await sleep(RETRY_DELAY_MS * attempt)
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'Unknown error fetching Google Sheets data.'
  throw new Error(message)
}

// Re-export type-only alias used elsewhere (avoid circular import churn).
export type { ExperimentRecord } from '../types/experiment'