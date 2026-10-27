// DEMO ONLY — remove this file (and the rest of src/demo) to retire demo mode.
// Demo mode is a presentation aid: it must never be mistaken for live data.

export const DEMO_MODE_STORAGE_KEY = 'flame-in-freefall:demo'

/**
 * Resolution order: explicit saved choice -> build-time default -> off.
 * A saved choice always wins so a user can switch demo off even when
 * VITE_DEMO_MODE=true was used for the build.
 */
export function resolveDemoMode(stored: string | null, envDefault: string | undefined): boolean {
  if (stored === 'true') return true
  if (stored === 'false') return false
  return envDefault === 'true'
}

export function readDemoModePreference(): boolean {
  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(DEMO_MODE_STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode / blocked cookies); fall back to env default.
    stored = null
  }
  return resolveDemoMode(stored, import.meta.env.VITE_DEMO_MODE)
}

export function writeDemoModePreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(DEMO_MODE_STORAGE_KEY, String(enabled))
  } catch {
    // Preference will not persist, but the session toggle still works.
  }
}
