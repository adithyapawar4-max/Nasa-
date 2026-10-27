// DEMO ONLY — remove this file (and the rest of src/demo) to retire demo mode.
import { createContext, useContext } from 'react'

export interface DemoModeContextValue {
  demoEnabled: boolean
  setDemoEnabled: (enabled: boolean) => void
  toggleDemoMode: () => void
}

export const DemoModeContext = createContext<DemoModeContextValue | null>(null)

export function useDemoMode(): DemoModeContextValue {
  const value = useContext(DemoModeContext)
  if (!value) {
    throw new Error('useDemoMode must be used inside <DemoModeProvider>')
  }
  return value
}
