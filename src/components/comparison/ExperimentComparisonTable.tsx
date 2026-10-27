import type { ReactElement } from 'react'
import { Droplets, Flame, Timer, Wind, Layers } from 'lucide-react'
import type { ExperimentRecord } from '../../types/experiment'
import { compareExperiments, DEFAULT_COMPARISON_FIELDS } from '../../utils/compareExperiments'
import { formatNumber } from '../../utils/format'

const ROW_META: Record<string, { icon: ReactElement; name: string; unit: string | null; numeric: boolean }> = {
  material: { icon: <Layers className="h-3.5 w-3.5" />, name: 'Material', unit: null, numeric: false },
  airflow_cm_s: { icon: <Wind className="h-3.5 w-3.5" />, name: 'Airflow', unit: 'cm/s', numeric: true },
  spread_rate_cm_s: { icon: <Flame className="h-3.5 w-3.5" />, name: 'Spread rate', unit: 'cm/s', numeric: true },
  burn_duration_s: { icon: <Timer className="h-3.5 w-3.5" />, name: 'Burn duration', unit: 's', numeric: true },
  oxygen_percent: { icon: <Droplets className="h-3.5 w-3.5" />, name: 'Oxygen', unit: '%', numeric: true },
}

export interface ExperimentComparisonTableProps {
  experimentA: ExperimentRecord | null
  experimentB: ExperimentRecord | null
}

export function ExperimentComparisonTable({ experimentA, experimentB }: ExperimentComparisonTableProps) {
  if (!experimentA || !experimentB) {
    return (
      <div className="rounded-md border border-cyan-400/15 bg-[#0B1622] px-3 py-6 text-center text-[11px] text-slate-400">
        Select two experiments to compare their reported conditions.
      </div>
    )
  }

  const result = compareExperiments(experimentA, experimentB, { fields: DEFAULT_COMPARISON_FIELDS })

  return (
    <div className="overflow-hidden rounded-md border border-cyan-400/15 bg-[#0B1622]">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-cyan-400/10 bg-[#0F1A2A] text-[10px] uppercase tracking-[0.12em] text-slate-400">
            <th scope="col" className="px-3 py-2 text-left font-medium">Parameter</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">{experimentA.experiment_id}</th>
            <th scope="col" className="px-3 py-2 text-right font-medium">{experimentB.experiment_id}</th>
          </tr>
        </thead>
        <tbody>
          {result.differences.map((diff) => {
            const meta = ROW_META[diff.field] ?? { icon: null, name: diff.label, unit: diff.unit, numeric: false }
            const displayA = diff.field === 'material'
              ? experimentA.material ?? '—'
              : formatNumber(diff.valueA, meta.unit)
            const displayB = diff.field === 'material'
              ? experimentB.material ?? '—'
              : formatNumber(diff.valueB, meta.unit)

            return (
              <tr key={String(diff.field)} className="border-b border-cyan-400/5 transition hover:bg-cyan-400/[0.04] last:border-0">
                <th scope="row" className="px-3 py-2.5 text-left font-medium text-slate-300">
                  <span className="flex items-center gap-2">
                    <span className="text-cyan-400/70">{meta.icon}</span>
                    <span>{meta.name}</span>
                    {meta.unit && <span className="text-[10px] text-slate-500">({meta.unit})</span>}
                  </span>
                </th>
                <td className="px-3 py-2.5 text-right text-slate-100 tabular-nums">{displayA}</td>
                <td className="px-3 py-2.5 text-right text-slate-100 tabular-nums">{displayB}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}