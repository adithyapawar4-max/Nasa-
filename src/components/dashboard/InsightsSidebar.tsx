export function InsightsSidebar() {
  return (
    <aside className="w-[320px] bg-[#0B0F17]/80 backdrop-blur-md h-full rounded-3xl border border-white/5 p-6 space-y-6">
      <h2 className="text-sm font-semibold tracking-wide text-cyan-400">✦ IA Insights</h2>
      
      <div className="space-y-4">
        <h3 className="text-xs text-slate-400">Predictions</h3>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-slate-300">Satellite Starlink-3210</p>
            <p className="text-xs text-amber-500 mt-2">⚠ Risk of collision with Cosmos-456 (72h)</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xs text-slate-400">About to expire</h3>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs text-slate-300">Hubble Space Telescope</p>
            <p className="text-xs text-amber-500 mt-2">⚠ 6 months old</p>
        </div>
      </div>
    </aside>
  )
}
