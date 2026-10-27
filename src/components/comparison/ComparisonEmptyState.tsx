import { FlaskConical } from 'lucide-react'

export function ComparisonEmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="glass-card grid min-h-[12rem] place-items-center rounded-lg p-6 text-center animate-in">
      <div>
        <FlaskConical className="mx-auto mb-2 h-6 w-6 text-cyan-400/60" />
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-xs text-slate-400">{message}</p>
      </div>
    </div>
  )
}