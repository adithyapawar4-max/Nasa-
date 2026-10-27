import type { ExperimentRecord } from '../types/experiment'

const METRIC_FIELDS = ['spread_rate_cm_s', 'burn_duration_s'] as const
export type MetricField = (typeof METRIC_FIELDS)[number]

export interface ChartDatum {
  label: string
  value: number | null
  material: string | null
  experimentId: string
}

export function buildMetricChartData(
  experimentA: ExperimentRecord | null,
  experimentB: ExperimentRecord | null,
  field: MetricField,
): ChartDatum[] {
  const rows: ChartDatum[] = []
  if (experimentA) {
    rows.push({
      label: experimentA.experiment_id,
      value: (experimentA[field] as number | null) ?? null,
      material: experimentA.material,
      experimentId: experimentA.experiment_id,
    })
  }
  if (experimentB) {
    rows.push({
      label: experimentB.experiment_id,
      value: (experimentB[field] as number | null) ?? null,
      material: experimentB.material,
      experimentId: experimentB.experiment_id,
    })
  }
  return rows
}

export function hasAnyValue(data: ChartDatum[]): boolean {
  return data.some((d) => d.value !== null && Number.isFinite(d.value))
}