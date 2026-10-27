import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ExperimentRecord } from '../../types/experiment'
import type { ChartDatum } from '../../utils/chartData'
import { buildMetricChartData } from '../../utils/chartData'

function valueLabel(value: number | null, unit: string): string {
  return value === null || !Number.isFinite(value) ? 'Not reported' : `${value} ${unit}`
}

export interface MetricChartProps {
  experimentA: ExperimentRecord | null
  experimentB: ExperimentRecord | null
}

function ChartBody({ data, unit }: { data: ChartDatum[]; unit: string }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#8aa3b8', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8aa3b8', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          unit={unit}
          width={36}
        />
        <Tooltip
          cursor={{ fill: 'rgba(0,229,255,0.06)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload as ChartDatum
            return (
              <div className="rounded-md border border-cyan-400/30 bg-slate-900/95 px-3 py-2 text-xs shadow-lg">
                <div className="font-semibold text-white">{d.experimentId}</div>
                <div className="text-slate-400">{d.material ?? 'Material not reported'}</div>
                <div className="mt-1 text-cyan-300">{valueLabel(d.value, unit)}</div>
              </div>
            )
          }}
        />
        <Bar dataKey="value" fill="#00b4d8" radius={[3, 3, 0, 0]} maxBarSize={38} isAnimationActive={false}>
          <LabelList dataKey="value" position="top" fill="#a9c1d6" fontSize={9} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function BurnDurationChart({ experimentA, experimentB }: MetricChartProps) {
  const data = buildMetricChartData(experimentA, experimentB, 'burn_duration_s')
  if (!data.length) return null
  return <ChartBody data={data} unit="s" />
}