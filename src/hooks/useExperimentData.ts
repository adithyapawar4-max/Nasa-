import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchExperimentRecords, isGoogleSheetsConfigured } from '../services/googleSheetsService'
import { DEMO_EXPERIMENT_RECORDS } from '../demo/demoExperiments'
import type { ExperimentRecord } from '../types/experiment'
import type { DataStatus, ExperimentDataState } from '../types/experiment'

const DEFAULT_INTERVAL_MS = 60_000

function readRefreshInterval(): number {
  const raw = import.meta.env.VITE_GOOGLE_SHEETS_REFRESH_INTERVAL_MS
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_INTERVAL_MS
}

export function useExperimentData(demoEnabled: boolean): ExperimentDataState {
  const [records, setRecords] = useState<ExperimentRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [dataStatus, setDataStatus] = useState<DataStatus>('idle')
  const [isDemo, setIsDemo] = useState<boolean>(demoEnabled)

  const mountedRef = useRef(true)
  const controllerRef = useRef<AbortController | null>(null)
  const hasDataRef = useRef(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [])

  const load = useCallback(async (isManual: boolean, useDemo: boolean) => {
    // Demo mode is an explicit override: never fetch or mix live records while it is on.
    if (useDemo) {
      if (mountedRef.current) {
        setRecords(DEMO_EXPERIMENT_RECORDS)
        setLastUpdated(new Date())
        setWarning('Demo data is shown — synthetic records, not real measurements.')
        setError(null)
        hasDataRef.current = true
        setDataStatus('fresh')
        setIsDemo(true)
        setLoading(false)
        setRefreshing(false)
      }
      return
    }

    if (!isGoogleSheetsConfigured()) {
      if (mountedRef.current) {
        setRecords([])
        setLoading(false)
        setDataStatus('error')
        setIsDemo(false)
        setError(
          'Google Sheets is not configured. Add VITE_GOOGLE_SHEETS_ID, VITE_GOOGLE_SHEETS_RANGE, and VITE_GOOGLE_SHEETS_API_KEY to your .env file.',
        )
      }
      return
    }

    setIsDemo(false)

    const requestId = ++requestIdRef.current
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    if (isManual) setRefreshing(true)
    else if (!hasDataRef.current) setLoading(true)

    try {
      const result = await fetchExperimentRecords(controller.signal)
      if (!mountedRef.current || requestId !== requestIdRef.current) return
      setRecords(result.records)
      setLastUpdated(result.fetchedAt)
      setError(null)
      const message = result.warnings.length ? result.warnings.join(' ') : null
      setWarning(message)
      hasDataRef.current = true
      setDataStatus('fresh')
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) return
      if (err instanceof DOMException && err.name === 'AbortError') return
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (hasDataRef.current) {
        // Preserve last successful data; surface non-blocking warning.
        setWarning(`Refresh failed: ${message}`)
        setDataStatus('stale')
      } else {
        setError(message)
        setDataStatus('error')
      }
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    // Switching data source must never leave records from the previous source on screen.
    requestIdRef.current += 1
    controllerRef.current?.abort()
    hasDataRef.current = false
    setRecords([])
    setLastUpdated(null)
    setError(null)
    setWarning(null)
    setIsDemo(demoEnabled)
    setDataStatus('idle')
    setRefreshing(false)
    setLoading(true)

    void load(false, demoEnabled)

    const interval = window.setInterval(() => {
      if (!cancelled) void load(false, demoEnabled)
    }, readRefreshInterval())
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [load, demoEnabled])

  const refresh = useCallback(async () => {
    await load(true, demoEnabled)
  }, [load, demoEnabled])

  return {
    records,
    loading,
    refreshing,
    error,
    warning,
    lastUpdated,
    dataStatus,
    isDemo,
    refresh,
  }
}
