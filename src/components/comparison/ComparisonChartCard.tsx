import type { ReactNode } from 'react'

export interface ComparisonChartCardProps {
  title: string
  tag?: string
  children: ReactNode
  empty?: boolean
  emptyMessage?: string
}

export function ComparisonChartCard({ title, tag, children, empty, emptyMessage }: ComparisonChartCardProps) {
  return (
    <section
      aria-label={title}
      className="rounded-md border border-cyan-400/15 bg-[#0B1622] p-3"
    >
      <header className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-200">{title}</h3>
        {tag && (
          <span className="rounded-sm border border-cyan-400/20 bg-cyan-400/5 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-cyan-300/80">
            {tag}
          </span>
        )}
      </header>
      {empty ? (
        <div className="grid h-52 place-items-center rounded-sm border border-dashed border-cyan-400/15 bg-[#0A1020] text-center text-[11px] text-slate-400">
          {emptyMessage ?? 'No reported values available for this metric.'}
        </div>
      ) : (
        <div className="h-52 w-full">{children}</div>
      )}
    </section>
  )
}