import { describe, expect, it } from 'vitest'
import { normalizeRows, parseNumeric } from '../utils/normalizeExperiment'

describe('parseNumeric', () => {
  it('parses numbers and rejects missing tokens', () => {
    expect(parseNumeric('4.2')).toBe(4.2)
    expect(parseNumeric('1,234.5')).toBe(1234.5)
    expect(parseNumeric('')).toBeNull()
    expect(parseNumeric('N/A')).toBeNull()
    expect(parseNumeric('—')).toBeNull()
    expect(parseNumeric(null)).toBeNull()
    expect(parseNumeric('0')).toBe(0)
  })
})

describe('normalizeRows', () => {
  it('maps headers and normalizes rows including blanks', () => {
    const result = normalizeRows(
      ['Test ID', 'Material Name', 'Airflow (cm/s)', 'Spread Rate (cm/s)', 'Burn Duration (s)'],
      [
        ['A', 'SIBAL', '4.2', '', '12.4'],
        ['B', '', '5.1', '1.1', null],
      ],
    )
    expect(result.records).toHaveLength(2)
    expect(result.records[0].experiment_id).toBe('A')
    expect(result.records[0].spread_rate_cm_s).toBeNull()
    expect(result.records[0].burn_duration_s).toBe(12.4)
    expect(result.records[1].material).toBeNull()
    expect(result.records[1].spread_rate_cm_s).toBe(1.1)
  })

  it('derives an ID when missing and records a warning', () => {
    const result = normalizeRows(['Material'], [['SIBAL']])
    expect(result.records[0].experiment_id).toBe('row-2')
    expect(result.records[0].derivedId).toBe(true)
    expect(result.warnings.join(' ')).toContain('experiment identifier')
  })
})