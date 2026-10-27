// Normalized experiment model used across Comparison UI and data access.
// All measurements are nullable: a missing value is never converted to zero.

export interface ExperimentRecord {
  /** Stable identifier used in dropdowns, URLs, and lookups. Never fabricated measurement data. */
  experiment_id: string
  experiment_name: string | null
  experiment_series: string | null
  test_number: string | null
  material: string | null
  airflow_cm_s: number | null
  oxygen_percent: number | null
  spread_rate_cm_s: number | null
  burn_duration_s: number | null
  test_date: string | null
  source_report: string | null
  source_page: string | null
  notes: string | null
  /** True when experiment_id had to be derived because the sheet lacked an ID column. */
  derivedId?: boolean
  /** 1-based spreadsheet row number this record came from (traceability). */
  source_row?: number
}

export type ExperimentField = keyof ExperimentRecord

// Fields that are compared numerically.
export const NUMERIC_FIELDS = [
  'airflow_cm_s',
  'oxygen_percent',
  'spread_rate_cm_s',
  'burn_duration_s',
] as const satisfies readonly ExperimentField[]

// Fields that are compared categorically (match / no match).
export const CATEGORICAL_FIELDS = ['material'] as const satisfies readonly ExperimentField[]

export type ComparisonOperator = 'numeric' | 'categorical' | 'none'

export interface ExperimentDifference {
  field: ExperimentField
  label: string
  unit: string | null
  valueA: number | null
  valueB: number | null
  absoluteDifference: number | null
  percentageDifference: number | null
  higherSide: 'A' | 'B' | 'equal' | null
  withinPrecision: boolean
}

export interface ExperimentComparisonResult {
  experimentA: ExperimentRecord
  experimentB: ExperimentRecord
  differences: ExperimentDifference[]
}

export type DataStatus = 'idle' | 'loading' | 'fresh' | 'stale' | 'error'

export interface ExperimentDataState {
  records: ExperimentRecord[]
  loading: boolean
  refreshing: boolean
  error: string | null
  warning: string | null
  lastUpdated: Date | null
  dataStatus: DataStatus
  isDemo: boolean
  refresh: () => Promise<void>
}