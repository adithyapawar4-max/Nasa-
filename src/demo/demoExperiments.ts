// SYNTHETIC DEMO DATA ONLY.
// These records are not real experiment measurements. They exist solely to let
// the Comparison page be exercised without a configured Google Sheet.
// Demo mode is toggled from the Settings menu and persisted in localStorage.
// Never present these records as real measurements.
import type { ExperimentRecord } from '../types/experiment'

export const DEMO_EXPERIMENT_RECORDS: ExperimentRecord[] = [
  {
    experiment_id: 'DEMO-A',
    experiment_name: 'Demo combustion test A (synthetic)',
    experiment_series: 'Demo series',
    test_number: 'A-1',
    material: 'SIBAL (demo)',
    airflow_cm_s: 4.2,
    oxygen_percent: 18.5,
    spread_rate_cm_s: 0.8,
    burn_duration_s: 12.4,
    test_date: '2026-01-01',
    source_report: 'https://example.com/demo-report-a',
    source_page: 'p. 4 (demo)',
    notes: 'Synthetic record. Not a real measurement.',
    derivedId: false,
  },
  {
    experiment_id: 'DEMO-B',
    experiment_name: 'Demo combustion test B (synthetic)',
    experiment_series: 'Demo series',
    test_number: 'B-2',
    material: 'Netel (demo example)',
    airflow_cm_s: 5.1,
    oxygen_percent: 20.2,
    spread_rate_cm_s: null,
    burn_duration_s: 10.8,
    test_date: '2026-01-02',
    source_report: null,
    source_page: null,
    notes: 'Synthetic record. Spread rate intentionally unreported.',
    derivedId: false,
  },
  {
    experiment_id: 'DEMO-C',
    experiment_name: 'Demo combustion test C (synthetic)',
    experiment_series: 'Demo series',
    test_number: 'C-3',
    material: 'PMMA (demo)',
    airflow_cm_s: 3.6,
    oxygen_percent: 16.0,
    spread_rate_cm_s: 1.1,
    burn_duration_s: null,
    test_date: '2026-01-03',
    source_report: 'https://example.com/demo-report-c',
    source_page: 'p. 9 (demo)',
    notes: 'Synthetic record. Burn duration intentionally unreported.',
    derivedId: false,
  },
]
