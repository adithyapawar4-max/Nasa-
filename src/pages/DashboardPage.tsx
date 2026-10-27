import { InteractiveGlobe } from '../components/dashboard/InteractiveGlobe'
import { InsightsSidebar } from '../components/dashboard/InsightsSidebar'
import { AnalyticsCards } from '../components/dashboard/AnalyticsCards'

export function DashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#070A0F] text-slate-100 overflow-hidden font-sans flex flex-col">
      <InteractiveGlobe />
      
      {/* HUD Layer */}
      <div className="relative z-10 flex flex-col h-screen p-6">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-widest">NASA</h1>
            <nav className="flex gap-6 bg-[#0B0F17]/50 border border-white/10 rounded-full px-8 py-3 backdrop-blur-md">
                {['HOME', 'SATELLITES', 'ORBITS', 'RELEASES'].map(item => (
                    <button key={item} className={`text-xs tracking-widest ${item === 'HOME' ? 'text-cyan-400 bg-cyan-400/10 px-4 py-1 rounded-full' : 'text-slate-400'}`}>
                        {item}
                    </button>
                ))}
            </nav>
            <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full border border-white/20 bg-slate-800"></div>
            </div>
        </header>

        <main className="flex-grow flex items-center justify-between">
            <div className="w-1/4">
                {/* Left floating cards */}
            </div>
            <div className="w-1/2 flex justify-center">
                {/* Prompt bar */}
            </div>
            <div className="w-1/4 h-full flex justify-end">
                <InsightsSidebar />
            </div>
        </main>
        
        <AnalyticsCards />
      </div>
    </div>
  )
}
