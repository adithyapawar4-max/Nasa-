import { ArrowLeftRight, ChevronDown } from 'lucide-react'
import type { ExperimentRecord } from '../../types/experiment'

export interface ExperimentSelectorProps {
  records: ExperimentRecord[]
  selectedA: string | null
  selectedB: string | null
  onChangeA: (id: string | null) => void
  onChangeB: (id: string | null) => void
  onSwap: () => void
}

function labelFor(record: ExperimentRecord): string {
  const series = record.experiment_series
  const test = record.test_number
  const suffix = [series, test ? `Test ${test}` : null].filter(Boolean).join(' · ')
  return suffix || record.experiment_id
}

export function ExperimentSelector({
  records,
  selectedA,
  selectedB,
  onChangeA,
  onChangeB,
  onSwap,
}: ExperimentSelectorProps) {
  const hasEnough = records.length >= 2
  const recordForA = records.find((r) => r.experiment_id === selectedA) ?? null
  const recordForB = records.find((r) => r.experiment_id === selectedB) ?? null

  if (!hasEnough) {
    return (
      <div
        role="status"
        className="rounded-md border border-cyan-400/15 bg-[#0B1622] px-3 py-2.5 text-[11px] text-slate-300"
      >
        Two experiments are required for comparison. Only {records.length} experiment
        {records.length === 1 ? ' is' : 's are'} currently available.
      </div>
    )
  }

  return (
    <div className="grid items-end gap-3 md:grid-cols-[1fr_36px_1fr]">
      <div className="space-y-1">
        <label htmlFor="experiment-a" className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
          Experiment A
        </label>
        <div className="relative">
          <select
            id="experiment-a"
            name="experimentA"
            value={selectedA ?? ''}
            onChange={(e) => onChangeA(e.target.value || null)}
            className="h-9 w-full appearance-none rounded-md border border-cyan-400/15 bg-[#0B1622] px-2.5 pr-8 text-[12px] text-white transition focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          >
            <option value="">Select experiment A…</option>
            {records.map((r) => (
              <option key={r.experiment_id} value={r.experiment_id} disabled={r.experiment_id === selectedB}>
                {labelFor(r)}
                {r.derivedId ? ' (derived)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
        {recordForA && (
          <p className="text-[10px] text-slate-500">
            {recordForA.material ?? 'Material not reported'}
          </p>
        )}
      </div>

      <div className="flex justify-center pb-1">
        <button
          type="button"
          onClick={onSwap}
          disabled={!selectedA || !selectedB}
          aria-label="Swap Experiment A and Experiment B"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-cyan-400/25 bg-[#0B1622] text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-400/5 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-1">
        <label htmlFor="experiment-b" className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
          Experiment B
        </label>
        <div className="relative">
          <select
            id="experiment-b"
            name="experimentB"
            value={selectedB ?? ''}
            onChange={(e) => onChangeB(e.target.value || null)}
            className="h-9 w-full appearance-none rounded-md border border-cyan-400/15 bg-[#0B1622] px-2.5 pr-8 text-[12px] text-white transition focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          >
            <option value="">Select experiment B…</option>
            {records.map((r) => (
              <option key={r.experiment_id} value={r.experiment_id} disabled={r.experiment_id === selectedA}>
                {labelFor(r)}
                {r.derivedId ? ' (derived)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
        {recordForB && (
          <p className="text-[10px] text-slate-500">
            {recordForB.material ?? 'Material not reported'}
          </p>
        )}
      </div>
    </div>
  )
}

export { labelFor as buildExperimentLabel }