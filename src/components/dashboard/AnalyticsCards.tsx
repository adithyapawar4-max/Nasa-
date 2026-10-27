export function AnalyticsCards() {
  return (
    <div className="flex gap-6 mt-6">
      <div className="flex-1 bg-[#0B0F17]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5">
        <h3 className="text-sm text-slate-400">Satellites by Country</h3>
        <p className="text-3xl font-bold mt-2">5300 <span className="text-sm font-normal text-slate-500">Satellites</span></p>
        <div className="h-24 bg-slate-900 mt-4 rounded-xl"></div>
      </div>
      <div className="flex-1 bg-[#0B0F17]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5">
        <h3 className="text-sm text-slate-400">Releases</h3>
        <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs bg-slate-900 p-2 rounded"><span>SpaceX Falcon 9</span><span>Jan 12</span></div>
            <div className="flex justify-between text-xs bg-slate-900 p-2 rounded"><span>CNSA Long March 5</span><span>Feb 05</span></div>
        </div>
      </div>
      <div className="flex-1 bg-[#0B0F17]/80 backdrop-blur-md p-6 rounded-3xl border border-white/5">
        <h3 className="text-sm text-slate-400">Satellites by purpose</h3>
        <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs"><span>Communications</span><span>5200</span></div>
            <div className="w-full bg-slate-800 h-1 rounded-full"><div className="bg-cyan-500 h-full w-3/4 rounded-full"></div></div>
        </div>
      </div>
    </div>
  )
}
