"use client"

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface KegiatanChartProps {
  data: { name: string; fullName: string; value: string; count: number }[]
}

const COLORS = ["#0369a1", "#0891b2", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#db2777"]

export function KegiatanChart({ data }: KegiatanChartProps) {
  if (data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">Belum ada data survey</div>
  }

  return (
    <ChartContainer
      config={{
        count: {
          label: "Jumlah",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 20, bottom: 60 }}>
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} tick={{ fontSize: 11 }} height={80} />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{item.fullName}</p>
                    <p className="mt-1 text-sm font-medium text-foreground">Responden: {item.count}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
