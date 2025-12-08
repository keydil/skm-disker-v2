"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface IkmChartProps {
  data: { unsur: string; label: string; nilai: number }[]
}

export function IkmChart({ data }: IkmChartProps) {
  if (data.every((d) => d.nilai === 0)) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">Belum ada data survey</div>
  }

  const getBarColor = (nilai: number) => {
    if (nilai >= 3.5) return "#16a34a" // success - green
    if (nilai >= 3) return "#0369a1" // primary - blue
    if (nilai >= 2.5) return "#d97706" // warning - orange
    return "#dc2626" // destructive - red
  }

  return (
    <ChartContainer
      config={{
        nilai: {
          label: "Nilai",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis type="number" domain={[0, 4]} tickCount={5} />
          <YAxis type="category" dataKey="unsur" width={40} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{item.unsur}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">Nilai: {item.nilai.toFixed(2)}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="nilai" radius={4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.nilai)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
