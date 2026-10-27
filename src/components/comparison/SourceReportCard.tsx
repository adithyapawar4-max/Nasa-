import { ExternalLink, FileText } from 'lucide-react'
import { isValidUrl } from '../../utils/format'

export interface SourceReportCardProps {
  experimentId: string
  sourceReport: string | null
  sourcePage: string | null
}

export function SourceReportCard({ experimentId, sourceReport, sourcePage }: SourceReportCardProps) {
  const available = isValidUrl(sourceReport)
  return (
    <section className="rounded-md border border-cyan-400/15 bg-[#0B1622] p-3">
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-cyan-400/15 bg-cyan-400/5 text-cyan-300/80">
          <FileText className="h-3.5 w-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">Source report</p>
          <p className="truncate text-[12px] font-medium text-slate-100">{experimentId}</p>
          {sourcePage && <p className="text-[10px] text-slate-500">Page: {sourcePage}</p>}
        </div>
        <div className="shrink-0">
          {available ? (
            <a
              href={sourceReport as string}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-300 hover:text-cyan-200"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-500">Unavailable</span>
          )}
        </div>
      </div>
    </section>
  )
}