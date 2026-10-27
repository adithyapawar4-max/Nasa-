import type { ExperimentField } from '../types/experiment'

// Configurable header mapping layer.
// Keys are normalized header strings (lowercase, punctuation removed).
// Values are the normalized ExperimentRecord fields.
// Add or adjust entries here to match your spreadsheet's actual column names.
export const HEADER_FIELD_MAP: Record<string, ExperimentField> = {
  // experiment identifiers
  experiment_id: 'experiment_id',
  test_id: 'experiment_id',
  id: 'experiment_id',
  experiment: 'experiment_id',
  experiment_name: 'experiment_name',
  name: 'experiment_name',
  title: 'experiment_name',
  experiment_series: 'experiment_series',
  series: 'experiment_series',
  experiment_group: 'experiment_series',
  test_number: 'test_number',
  test_no: 'test_number',
  test: 'test_number',
  material: 'material',
  material_name: 'material',
  sample_material: 'material',
  airflow: 'airflow_cm_s',
  airflow_cm_s: 'airflow_cm_s',
  air_flow: 'airflow_cm_s',
  airflow_speed: 'airflow_cm_s',
  oxygen: 'oxygen_percent',
  oxygen_percent: 'oxygen_percent',
  oxygen_concentration: 'oxygen_percent',
  o2_percent: 'oxygen_percent',
  spread_rate: 'spread_rate_cm_s',
  spread_rate_cm_s: 'spread_rate_cm_s',
  spread: 'spread_rate_cm_s',
  flame_spread_rate: 'spread_rate_cm_s',
  burn_duration: 'burn_duration_s',
  burn_duration_s: 'burn_duration_s',
  duration: 'burn_duration_s',
  burn_time: 'burn_duration_s',
  test_date: 'test_date',
  date: 'test_date',
  source_report: 'source_report',
  source_report_url: 'source_report',
  report_url: 'source_report',
  source_document: 'source_report',
  document_url: 'source_report',
  source_page: 'source_page',
  page_reference: 'source_page',
  page: 'source_page',
  notes: 'notes',
  comments: 'notes',
}

// Try a fuzzy fallback so unknown but obvious names still map.
export function resolveExperimentField(normalizedHeader: string): ExperimentField | null {
  if (HEADER_FIELD_MAP[normalizedHeader]) return HEADER_FIELD_MAP[normalizedHeader]
  // contains-based fallbacks
  if (/spread.*rate|flame.*spread/.test(normalizedHeader)) return 'spread_rate_cm_s'
  if (/burn.*dur|duration/.test(normalizedHeader)) return 'burn_duration_s'
  if (/air.*flow/.test(normalizedHeader)) return 'airflow_cm_s'
  if (/oxygen|o2/.test(normalizedHeader)) return 'oxygen_percent'
  if (/material/.test(normalizedHeader)) return 'material'
  if (/report|document/.test(normalizedHeader) && /url|link|source/.test(normalizedHeader)) return 'source_report'
  if (/source/.test(normalizedHeader) && /page/.test(normalizedHeader)) return 'source_page'
  if (/series/.test(normalizedHeader)) return 'experiment_series'
  if (/test.*number|test_no/.test(normalizedHeader)) return 'test_number'
  if (/name/.test(normalizedHeader)) return 'experiment_name'
  if (/id|identifier/.test(normalizedHeader)) return 'experiment_id'
  if (/date/.test(normalizedHeader)) return 'test_date'
  if (/note|comment/.test(normalizedHeader)) return 'notes'
  return null
}