import { describe, expect, it } from 'vitest'
import { normalizeHeaderKey, normalizeHeaderKeys } from '../utils/normalizeHeader'

describe('normalizeHeaderKey', () => {
  it('lowercases and collapses punctuation', () => {
    expect(normalizeHeaderKey('Airflow (cm/s)')).toBe('airflow_cm_s')
    expect(normalizeHeaderKey('  Source Report URL  ')).toBe('source_report_url')
    expect(normalizeHeaderKey('')).toBe('')
  })
})

describe('normalizeHeaderKeys', () => {
  it('falls back to column_n for empty headers', () => {
    expect(normalizeHeaderKeys(['', 'X'])).toEqual(['column_1', 'x'])
  })
})