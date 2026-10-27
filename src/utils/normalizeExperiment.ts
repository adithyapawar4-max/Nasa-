import type { ExperimentField, ExperimentRecord } from '../types/experiment'
import { normalizeHeaderKey } from './normalizeHeader'
import { resolveExperimentField } from '../config/experimentHeaderMap'

export interface RawSheetRow {
  [header: string]: string | number | null | undefined
}

export interface NormalizedSheetData {
  headers: string[]
  normalizedHeaders: string[]
  fieldMap: Partial<Record<ExperimentField, number>>
  records: ExperimentRecord[]
  warnings: string[]
}

export function parseNumeric(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const text = String(value).trim()
  if (!text) return null
  // Treat common missing-value tokens as null, not zero.
  if (/^(n\/a|na|null|none|not reported|—|-)$/i.test(text)) return null
  const cleaned = text.replace(/,/g, '').replace(/[^\d.eE+-].*$/, '')
  const number = Number(cleaned)
  if (Number.isFinite(number)) return number
  const fallback = parseFloat(text)
  return Number.isFinite(fallback) ? fallback : null
}

export function stringifyCell(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

export function normalizeRows(
  rawHeaders: readonly unknown[],
  rawRows: readonly (readonly unknown[])[],
): NormalizedSheetData {
  const headers = rawHeaders.map((h, i) => String(h ?? `Column ${i + 1}`).trim())
  const normalizedHeaders = headers.map(normalizeHeaderKey)

  // Resolve each column to at most one logical field. First match wins, to avoid
  // duplicating the same logical field when aliases repeat.
  const fieldMap: Partial<Record<ExperimentField, number>> = {}
  const usedFields = new Set<ExperimentField>()
  const warnings: string[] = []
  normalizedHeaders.forEach((nh, index) => {
    const field = resolveExperimentField(nh)
    if (field && !usedFields.has(field)) {
      fieldMap[field] = index
      usedFields.add(field)
    }
  })

  const records: ExperimentRecord[] = rawRows
    .map((row, rowIndex) => {
      // Skip completely blank rows.
      if (!row || row.every((cell) => stringifyCell(cell) === null)) return null

      const get = (field: ExperimentField): unknown => {
        const idx = fieldMap[field]
        return idx === undefined ? undefined : row[idx]
      }

      const record: ExperimentRecord = {
        experiment_id: '',
        experiment_name: stringifyCell(get('experiment_name')),
        experiment_series: stringifyCell(get('experiment_series')),
        test_number: stringifyCell(get('test_number')),
        material: stringifyCell(get('material')),
        airflow_cm_s: parseNumeric(get('airflow_cm_s')),
        oxygen_percent: parseNumeric(get('oxygen_percent')),
        spread_rate_cm_s: parseNumeric(get('spread_rate_cm_s')),
        burn_duration_s: parseNumeric(get('burn_duration_s')),
        test_date: stringifyCell(get('test_date')),
        source_report: stringifyCell(get('source_report')),
        source_page: stringifyCell(get('source_page')),
        notes: stringifyCell(get('notes')),
        source_row: rowIndex + 2, // account for header row
      }

      const rawId = stringifyCell(get('experiment_id'))
      if (rawId) {
        record.experiment_id = rawId
      } else {
        // Derived identifier only. Never a measurement.
        record.experiment_id = `row-${rowIndex + 2}`
        record.derivedId = true
        warnings.push(`Row ${rowIndex + 2} had no experiment identifier; derived "${record.experiment_id}".`)
      }

      return record
    })
    .filter((r): r is ExperimentRecord => r !== null)

  if (!fieldMap.experiment_id && records.length > 0) {
    warnings.push('No column mapped to experiment_id; identifiers were derived from row numbers.')
  }

  return { headers, normalizedHeaders, fieldMap, records, warnings }
}