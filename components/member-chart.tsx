"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "01 Apr", newMembers: 5, newProspects: 20, cancellations: 1 },
  { name: "02 Apr", newMembers: 3, newProspects: 25, cancellations: 0 },
  { name: "03 Apr", newMembers: 8, newProspects: 35, cancellations: 2 },
  { name: "04 Apr", newMembers: 6, newProspects: 45, cancellations: 1 },
  { name: "05 Apr", newMembers: 12, newProspects: 60, cancellations: 0 },
  { name: "06 Apr", newMembers: 10, newProspects: 75, cancellations: 1 },
  { name: "07 Apr", newMembers: 15, newProspects: 110, cancellations: 2 },
]

export default function MemberChart() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Member Changes</h3>
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-2 rounded-sm"></div>
          <span className="text-xs text-muted-foreground">New Members</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-4 rounded-sm"></div>
          <span className="text-xs text-muted-foreground">New Prospects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-danger rounded-sm"></div>
          <span className="text-xs text-muted-foreground">Cancellations</span>
        </div>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">&lt;</span>
        <span className="text-xs text-muted-foreground font-medium">April</span>
        <span className="text-xs text-muted-foreground">&gt;</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorNewMembers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.70 0.15 240)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.70 0.15 240)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNewProspects" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.15 120)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.15 120)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCancellations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.62 0.22 25)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0 0)" />
          <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0 0)", fontSize: 12 }} />
          <YAxis tick={{ fill: "oklch(0.68 0 0)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.22 0 0)",
              border: "1px solid oklch(0.30 0 0)",
              borderRadius: "6px",
              color: "oklch(0.98 0 0)",
            }}
          />
          <Area
            type="monotone"
            dataKey="newMembers"
            stroke="oklch(0.70 0.15 240)"
            fillOpacity={1}
            fill="url(#colorNewMembers)"
          />
          <Area
            type="monotone"
            dataKey="newProspects"
            stroke="oklch(0.65 0.15 120)"
            fillOpacity={1}
            fill="url(#colorNewProspects)"
          />
          <Area
            type="monotone"
            dataKey="cancellations"
            stroke="oklch(0.62 0.22 25)"
            fillOpacity={1}
            fill="url(#colorCancellations)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
