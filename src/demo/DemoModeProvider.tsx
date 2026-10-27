// DEMO ONLY — remove this file (and the rest of src/demo) to retire demo mode.
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DemoModeContext, type DemoModeContextValue } from './DemoModeContext'
import {
  DEMO_MODE_STORAGE_KEY,
  readDemoModePreference,
  resolveDemoMode,
  writeDemoModePreference,
} from './demoModeStorage'

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [demoEnabled, setDemoEnabledState] = useState<boolean>(readDemoModePreference)

  const setDemoEnabled = useCallback((enabled: boolean) => {
    setDemoEnabledState(enabled)
    writeDemoModePreference(enabled)
  }, [])

  const toggleDemoMode = useCallback(() => {
    setDemoEnabledState((previous) => {
      const next = !previous
      writeDemoModePreference(next)
      return next
    })
  }, [])

  // Keep other open tabs in sync with the saved preference.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== DEMO_MODE_STORAGE_KEY) return
      setDemoEnabledState(resolveDemoMode(event.newValue, import.meta.env.VITE_DEMO_MODE))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo<DemoModeContextValue>(
    () => ({ demoEnabled, setDemoEnabled, toggleDemoMode }),
    [demoEnabled, setDemoEnabled, toggleDemoMode],
  )

  return <DemoModeContext.Provider value={value}>{children}</DemoModeContext.Provider>
}
