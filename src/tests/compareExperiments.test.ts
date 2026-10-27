import { describe, expect, it } from 'vitest'
import { compareExperiments, compareField } from '../utils/compareExperiments'

function makeRecord(overrides: Record<string, unknown> = {}) {
  return {
    experiment_id: 'X',
    experiment_name: null,
    experiment_series: null,
    test_number: null,
    material: null,
    airflow_cm_s: null,
    oxygen_percent: null,
    spread_rate_cm_s: null,
    burn_duration_s: null,
    test_date: null,
    source_report: null,
    source_page: null,
    notes: null,
    ...overrides,
  } as any
}

describe('compareField', () => {
  it('calculates absolute and percentage difference with B as baseline delta', () => {
    const d = compareField('spread_rate_cm_s', 0.8, 1.1)
    expect(d.absoluteDifference).toBeCloseTo(0.3)
    expect(d.percentageDifference).toBeCloseTo(37.5)
    expect(d.higherSide).toBe('B')
  })

  it('returns null percentage for zero baseline', () => {
    const d = compareField('airflow_cm_s', 0, 5.1)
    expect(d.absoluteDifference).toBe(5.1)
    expect(d.percentageDifference).toBeNull()
    expect(d.higherSide).toBe('B')
  })

  it('marks equal within precision', () => {
    const d = compareField('burn_duration_s', 12.4, 12.4000001)
    expect(d.withinPrecision).toBe(true)
    expect(d.higherSide).toBe('equal')
  })

  it('handles categorical match', () => {
    const d = compareField('material', 'SIBAL', 'SIBAL')
    expect(d.withinPrecision).toBe(true)
  })
})

describe('compareExperiments', () => {
  it('compares full records', () => {
    const a = makeRecord({ experiment_id: 'A', material: 'SIBAL', spread_rate_cm_s: 0.8 })
    const b = makeRecord({ experiment_id: 'B', material: 'Netel', spread_rate_cm_s: 1.1 })
    const result = compareExperiments(a, b)
    expect(result.differences.find((d) => d.field === 'spread_rate_cm_s')?.absoluteDifference).toBeCloseTo(0.3)
    const mat = result.differences.find((d) => d.field === 'material')
    expect(mat?.withinPrecision).toBe(false)
  })
})