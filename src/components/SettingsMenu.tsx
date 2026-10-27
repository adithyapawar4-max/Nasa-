import { useEffect, useRef, type RefObject } from 'react'
import { Database, TriangleAlert, X } from 'lucide-react'
import { useDemoMode } from '../demo/DemoModeContext'
import { isGoogleSheetsConfigured } from '../services/googleSheetsService'

export interface SettingsMenuProps {
  open: boolean
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export function SettingsMenu({ open, onClose, triggerRef }: SettingsMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { demoEnabled, toggleDemoMode } = useDemoMode()
  const sheetsConfigured = isGoogleSheetsConfigured()

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
      triggerRef.current?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (panelRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open, onClose, triggerRef])

  if (!open) return null

  const sourceLabel = demoEnabled
    ? 'Demo mode active'
    : sheetsConfigured
      ? 'Google Sheets (live)'
      : 'Not configured'
  const sourceDetail = demoEnabled
    ? 'Synthetic records for previewing the comparison page.'
    : sheetsConfigured
      ? 'Reading the configured spreadsheet range.'
      : 'Add Google Sheets credentials in .env for live data.'

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby="settings-title"
      tabIndex={-1}
      className="absolute right-0 top-[calc(100%+10px)] z-50 w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-cyan-400/20 bg-[#0B1622] text-left shadow-[0_24px_60px_rgba(0,0,0,0.6)] focus:outline-none"
    >
      <header className="flex items-center justify-between gap-2 border-b border-cyan-400/10 px-3 py-2.5">
        <h2 id="settings-title" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200">
          Settings
        </h2>
        <button
          type="button"
          onClick={() => {
            onClose()
            triggerRef.current?.focus()
          }}
          aria-label="Close settings"
          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/60"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="space-y-3 px-3 py-3">
        <section aria-labelledby="settings-source-label">
          <p
            id="settings-source-label"
            className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400"
          >
            Data source
          </p>
          <div className="mt-1.5 flex items-center gap-2.5 rounded-md border border-cyan-400/15 bg-[#0A1020] px-2.5 py-2">
            <span
              className={
                demoEnabled
                  ? 'inline-flex h-2 w-2 shrink-0 rounded-full bg-amber-400'
                  : sheetsConfigured
                    ? 'inline-flex h-2 w-2 shrink-0 rounded-full bg-emerald-400'
                    : 'inline-flex h-2 w-2 shrink-0 rounded-full bg-slate-500'
              }
              aria-hidden="true"
            />
            <Database className="h-3.5 w-3.5 shrink-0 text-cyan-300/80" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-slate-100">{sourceLabel}</p>
              <p className="text-[10px] leading-snug text-slate-400">{sourceDetail}</p>
            </div>
          </div>
        </section>

        {/* DEMO ONLY — delete this section, src/demo/, and the provider in App.tsx to retire demo mode. */}
        <section
          aria-labelledby="demo-mode-label"
          className="rounded-md border border-amber-400/25 bg-amber-400/[0.04] px-2.5 py-2.5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p id="demo-mode-label" className="text-[12px] font-medium text-slate-100">
                Demo simulation
              </p>
              <p id="demo-mode-description" className="mt-0.5 text-[10px] leading-relaxed text-slate-400">
                Show clearly labeled synthetic experiments when no Google Sheet is available.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={demoEnabled}
              aria-labelledby="demo-mode-label"
              aria-describedby="demo-mode-description"
              onClick={toggleDemoMode}
              className={[
                'relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors',
                "after:absolute after:-inset-2 after:content-['']",
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1622]',
                demoEnabled
                  ? 'border-cyan-400/60 bg-cyan-400/30'
                  : 'border-white/15 bg-white/10 hover:border-cyan-400/40',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className={[
                  'inline-block h-3.5 w-3.5 rounded-full transition-transform',
                  demoEnabled ? 'translate-x-[18px] bg-cyan-200' : 'translate-x-[3px] bg-slate-300',
                ].join(' ')}
              />
            </button>
          </div>
          {demoEnabled && (
            <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-snug text-amber-200">
              <TriangleAlert className="mt-px h-3 w-3 shrink-0" aria-hidden="true" />
              Synthetic records are active. They are never mixed with live spreadsheet data.
            </p>
          )}
        </section>
      </div>

      <footer className="border-t border-cyan-400/10 px-3 py-2 text-[10px] text-slate-400">
        Settings are saved in this browser.
      </footer>
    </div>
  )
}
