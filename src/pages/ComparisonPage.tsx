import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { ExperimentSelector } from '../components/comparison/ExperimentSelector'
import { ExperimentComparisonTable } from '../components/comparison/ExperimentComparisonTable'
import { ComparisonChartCard } from '../components/comparison/ComparisonChartCard'
import { SpreadRateChart } from '../components/comparison/SpreadRateChart'
import { BurnDurationChart } from '../components/comparison/BurnDurationChart'
import { SourceReportCard } from '../components/comparison/SourceReportCard'
import { ComparisonEmptyState } from '../components/comparison/ComparisonEmptyState'
import { useDemoMode } from '../demo/DemoModeContext'
import { useExperimentData } from '../hooks/useExperimentData'
import type { ExperimentRecord } from '../types/experiment'
import { formatRelativeTime } from '../utils/format'

export function ComparisonPage() {
  const { demoEnabled } = useDemoMode()
  const { records, loading, refreshing, error, warning, lastUpdated, dataStatus, isDemo, refresh } =
    useExperimentData(demoEnabled)

  const [selectedA, setSelectedA] = useState<string | null>(null)
  const [selectedB, setSelectedB] = useState<string | null>(null)

  // Preserve valid IDs across refreshes; auto-select the first two experiments initially.
  useEffect(() => {
    if (records.length === 0) {
      setSelectedA(null)
      setSelectedB(null)
      return
    }
    setSelectedA((prev) => (prev && records.some((r) => r.experiment_id === prev) ? prev : records[0].experiment_id))
    setSelectedB((prev) => {
      if (prev && records.some((r) => r.experiment_id === prev)) return prev
      if (records.length < 2) return null
      const first = records[0].experiment_id
      return records[1].experiment_id === first ? (records[2]?.experiment_id ?? null) : records[1].experiment_id
    })
  }, [records])

  // Guard against both selections resolving to the same experiment after refresh.
  useEffect(() => {
    if (selectedA && selectedB && selectedA === selectedB && records.length > 1) {
      const next = records.find((r) => r.experiment_id !== selectedA)
      if (next) setSelectedB(next.experiment_id)
    }
  }, [selectedA, selectedB, records])

  const handleSwap = useCallback(() => {
    setSelectedA(selectedB)
    setSelectedB(selectedA)
  }, [selectedA, selectedB])

  const recordA = useMemo(
    () => (selectedA ? (records.find((r) => r.experiment_id === selectedA) ?? null) : null),
    [records, selectedA],
  )
  const recordB = useMemo(
    () => (selectedB ? (records.find((r) => r.experiment_id === selectedB) ?? null) : null),
    [records, selectedB],
  )

  const spreadHasValue =
    recordA?.spread_rate_cm_s != null || recordB?.spread_rate_cm_s != null
  const burnHasValue =
    recordA?.burn_duration_s != null || recordB?.burn_duration_s != null

  const isCached = dataStatus === 'stale'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-[1280px] px-6 py-6">
        <header className="mb-4">
          <h1 className="text-[22px] font-semibold tracking-tight text-white">Compare Experiments</h1>
          <p className="mt-1 text-[12px] text-slate-400">
            Select experiments to compare reported conditions and results.
          </p>
        </header>

        {isDemo && (
          <div className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11px] text-amber-100">
            Demo data is shown — synthetic records, not real measurements. Source links are placeholders. Turn it off
            in Settings.
          </div>
        )}

        {/* Refresh / status bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-cyan-400/15 bg-[#0B1622]/80 px-3 py-2 text-[11px]">
          <div className="flex items-center gap-2 text-slate-400">
            <span
              className={
                dataStatus === 'fresh'
                  ? 'inline-flex h-2 w-2 rounded-full bg-emerald-400'
                  : dataStatus === 'stale'
                    ? 'inline-flex h-2 w-2 rounded-full bg-amber-400'
                    : 'inline-flex h-2 w-2 rounded-full bg-slate-500'
              }
              aria-hidden="true"
            />
            <span>
              {loading
                ? 'Loading experiment data…'
                : error
                  ? 'Unable to load experiment data'
                  : lastUpdated
                    ? `Last updated ${formatRelativeTime(lastUpdated)}${isCached ? ' (cached — refresh failed)' : ''}`
                    : 'No data loaded yet'}
            </span>
            {warning && <span className="text-amber-300">{warning}</span>}
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 rounded-md border border-cyan-400/40 bg-cyan-400/5 px-3 py-1 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {loading && !records.length && (
          <ComparisonEmptyState
            title="Loading experiments"
            message="Fetching the latest experiment records from Google Sheets."
          />
        )}

        {error && !records.length && (
          <div className="space-y-3 rounded-lg border border-rose-400/30 bg-rose-400/5 p-4 text-sm text-rose-200">
            <p className="font-medium">Cannot load experiment data</p>
            <p className="text-rose-200/80">{error}</p>
            <p className="text-xs text-slate-400">
              Configure VITE_GOOGLE_SHEETS_ID, VITE_GOOGLE_SHEETS_RANGE, and VITE_GOOGLE_SHEETS_API_KEY in your .env
              file, ensure the sheet is readable, then refresh.
            </p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <ComparisonEmptyState
            title="No experiments found"
            message="The configured spreadsheet returned no experiment records."
          />
        )}

        {records.length > 0 && (
          <>
            <div className="mb-4">
              <ExperimentSelector
                records={records}
                selectedA={selectedA}
                selectedB={selectedB}
                onChangeA={setSelectedA}
                onChangeB={setSelectedB}
                onSwap={handleSwap}
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                {recordA && recordB ? (
                  <ExperimentComparisonTable experimentA={recordA} experimentB={recordB} />
                ) : (
                  <ComparisonEmptyState
                    title="Select two experiments"
                    message="Choose one experiment for A and another for B to see the comparison table."
                  />
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ComparisonChartCard
                  title="Spread rate comparison"
                  tag={isDemo ? 'Demo preview' : undefined}
                  empty={!spreadHasValue}
                  emptyMessage="No spread rate was reported for either experiment."
                >
                  <SpreadRateChart experimentA={recordA} experimentB={recordB} />
                </ComparisonChartCard>
                <ComparisonChartCard
                  title="Burn duration comparison"
                  tag={isDemo ? 'Demo preview' : undefined}
                  empty={!burnHasValue}
                  emptyMessage="No burn duration was reported for either experiment."
                >
                  <BurnDurationChart experimentA={recordA} experimentB={recordB} />
                </ComparisonChartCard>
              </div>
            </div>

            {recordA && recordB && (
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <SourceReportCard
                  experimentId={recordA.experiment_id}
                  sourceReport={recordA.source_report}
                  sourcePage={recordA.source_page}
                />
                <SourceReportCard
                  experimentId={recordB.experiment_id}
                  sourceReport={recordB.source_report}
                  sourcePage={recordB.source_page}
                />
              </div>
            )}

            <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-cyan-400/10 pt-3 text-[10px] text-slate-500">
              <span>Reported values only. Missing measurements are not treated as zero.</span>
              <span>Drag the background to rotate the globe.</span>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}

// Expose record type use for tests.
export type { ExperimentRecord }