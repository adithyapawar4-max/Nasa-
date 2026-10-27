import { describe, expect, it } from 'vitest'
import { buildMetricChartData, hasAnyValue } from '../utils/chartData'

describe('buildMetricChartData', () => {
  it('builds two entries from records', () => {
    const a = { experiment_id: 'A', material: 'SIBAL', spread_rate_cm_s: 0.8 } as any
    const b = { experiment_id: 'B', material: 'Netel', spread_rate_cm_s: null } as any
    const data = buildMetricChartData(a, b, 'spread_rate_cm_s')
    expect(data).toHaveLength(2)
    expect(data[0].value).toBe(0.8)
    expect(data[1].value).toBeNull()
    expect(hasAnyValue(data)).toBe(true)
  })

  it('returns empty for null inputs', () => {
    expect(buildMetricChartData(null, null, 'spread_rate_cm_s')).toHaveLength(0)
  })
})