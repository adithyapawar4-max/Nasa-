import type {
  ExperimentDifference,
  ExperimentField,
  ExperimentRecord,
  ExperimentComparisonResult,
} from '../types/experiment'

export interface CompareOptions {
  fields?: ExperimentField[]
}

const FIELD_LABELS: Partial<Record<ExperimentField, string>> = {
  experiment_id: 'Experiment ID',
  experiment_name: 'Experiment name',
  experiment_series: 'Series',
  test_number: 'Test number',
  material: 'Material',
  airflow_cm_s: 'Airflow',
  oxygen_percent: 'Oxygen concentration',
  spread_rate_cm_s: 'Spread rate',
  burn_duration_s: 'Burn duration',
  test_date: 'Test date',
  source_report: 'Source report',
  source_page: 'Source page',
  notes: 'Notes',
}

const FIELD_UNITS: Partial<Record<ExperimentField, string>> = {
  airflow_cm_s: 'cm/s',
  oxygen_percent: '%',
  spread_rate_cm_s: 'cm/s',
  burn_duration_s: 's',
}

function isNumericField(field: ExperimentField): field is 'airflow_cm_s' | 'oxygen_percent' | 'spread_rate_cm_s' | 'burn_duration_s' {
  return field === 'airflow_cm_s' || field === 'oxygen_percent' ||
    field === 'spread_rate_cm_s' || field === 'burn_duration_s'
}

function isCategoricalField(field: ExperimentField): field is 'material' {
  return field === 'material'
}

function round6(n: number): number {
  return Math.round(n * 1_000_000) / 1_000_000
}

export const DEFAULT_COMPARISON_FIELDS: ExperimentField[] = [
  'material',
  'airflow_cm_s',
  'spread_rate_cm_s',
  'burn_duration_s',
  'oxygen_percent',
]

export function compareField(
  field: ExperimentField,
  valueA: unknown,
  valueB: unknown,
): ExperimentDifference {
  const label = FIELD_LABELS[field] ?? field
  const unit = FIELD_UNITS[field] ?? null

  if (isNumericField(field)) {
    const a = (valueA as number | null) ?? null
    const b = (valueB as number | null) ?? null
    const bothPresent = typeof a === 'number' && typeof b === 'number'
    const withinPrecision = bothPresent && round6(a as number) === round6(b as number)
    let absoluteDifference: number | null = null
    let percentageDifference: number | null = null
    let higherSide: 'A' | 'B' | 'equal' | null = null

    if (bothPresent) {
      absoluteDifference = (b as number) - (a as number)
      const baseline = Math.abs(a as number)
      if (baseline !== 0) {
        percentageDifference = (((b as number) - (a as number)) / baseline) * 100
      } else {
        percentageDifference = null // zero baseline: no meaningful percentage
      }
      if (withinPrecision) higherSide = 'equal'
      else higherSide = (b as number) > (a as number) ? 'B' : 'A'
    }

    return {
      field,
      label,
      unit,
      valueA: a,
      valueB: b,
      absoluteDifference,
      percentageDifference,
      higherSide,
      withinPrecision,
    }
  }

  if (isCategoricalField(field)) {
    const a = (valueA as string | null) ?? null
    const b = (valueB as string | null) ?? null
    const withinPrecision = a !== null && b !== null && a === b
    return {
      field,
      label,
      unit,
      valueA: null, // categorical values are not numbers; use external display
      valueB: null,
      absoluteDifference: null,
      percentageDifference: null,
      higherSide: null,
      withinPrecision,
    }
  }

  // Generic / non-compared field: no numeric diff.
  return {
    field,
    label,
    unit,
    valueA: null,
    valueB: null,
    absoluteDifference: null,
    percentageDifference: null,
    higherSide: null,
    withinPrecision: false,
  }
}

export function compareExperiments(
  experimentA: ExperimentRecord,
  experimentB: ExperimentRecord,
  options: CompareOptions = {},
): ExperimentComparisonResult {
  const fields = options.fields ?? DEFAULT_COMPARISON_FIELDS
  const differences = fields.map((field) =>
    compareField(field, experimentA[field], experimentB[field]),
  )
  return { experimentA, experimentB, differences }
}

// Keep ExperimentComparisonResult import type used.
export type { ExperimentComparisonResult } from '../types/experiment'