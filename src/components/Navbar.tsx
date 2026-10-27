import { useCallback, useRef, useState } from 'react'
import { FlaskConical, Search, Settings } from 'lucide-react'
import { useDemoMode } from '../demo/DemoModeContext'
import { SettingsMenu } from './SettingsMenu'

const NAV_ITEMS: { label: string; href: string; active?: boolean }[] = [
  { label: 'Home', href: '#' },
  { label: 'Overview', href: '#' },
  { label: 'Experiments', href: '#' },
  { label: 'Compare', href: '#', active: true },
  { label: '3D View', href: '#' },
  { label: 'AI Insights', href: '#' },
]

export function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const { demoEnabled } = useDemoMode()

  const closeSettings = useCallback(() => setSettingsOpen(false), [])
  const toggleSettings = useCallback(() => setSettingsOpen((open) => !open), [])

  return (
    <header className="sticky top-0 z-30 h-[52px] border-b border-cyan-400/15 bg-[#050A14]/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-6">
        <a href="#" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-cyan-400/30 bg-cyan-400/5 text-cyan-300">
            <FlaskConical className="h-3.5 w-3.5" />
          </span>
          Flame in Freefall
        </a>

        <nav aria-label="Primary" className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              className={
                item.active
                  ? 'relative px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-300 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-cyan-400'
                  : 'px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 transition hover:text-slate-100'
              }
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-7 w-7 items-center justify-center rounded-sm border border-white/10 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <button
            ref={settingsButtonRef}
            type="button"
            aria-label={demoEnabled ? 'Settings (demo data active)' : 'Settings'}
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            aria-controls="settings-menu"
            onClick={toggleSettings}
            className={
              settingsOpen
                ? 'relative inline-flex h-7 w-7 items-center justify-center rounded-sm border border-cyan-400/50 bg-cyan-400/10 text-cyan-300'
                : 'relative inline-flex h-7 w-7 items-center justify-center rounded-sm border border-white/10 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300'
            }
          >
            <Settings className="h-3.5 w-3.5" />
            {demoEnabled && (
              <span
                aria-hidden="true"
                className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-amber-400 ring-1 ring-[#050A14]"
              />
            )}
          </button>

          <div id="settings-menu">
            <SettingsMenu open={settingsOpen} onClose={closeSettings} triggerRef={settingsButtonRef} />
          </div>
        </div>
      </div>
    </header>
  )
}
