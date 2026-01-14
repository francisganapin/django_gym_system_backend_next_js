"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jul", existing: 800, onHold: 120, newMembership: 80, rejoins: 40, cancelled: 30, expired: 10 },
  { month: "Aug", existing: 900, onHold: 140, newMembership: 100, rejoins: 50, cancelled: 25, expired: 15 },
  { month: "Sep", existing: 950, onHold: 160, newMembership: 120, rejoins: 60, cancelled: 30, expired: 20 },
  { month: "Oct", existing: 1000, onHold: 180, newMembership: 140, rejoins: 70, cancelled: 35, expired: 25 },
  { month: "Nov", existing: 1050, onHold: 200, newMembership: 160, rejoins: 80, cancelled: 40, expired: 30 },
  { month: "Dec", existing: 1100, onHold: 220, newMembership: 180, rejoins: 90, cancelled: 45, expired: 35 },
  { month: "Jan", existing: 1150, onHold: 240, newMembership: 200, rejoins: 100, cancelled: 50, expired: 40 },
  { month: "Feb", existing: 1200, onHold: 260, newMembership: 220, rejoins: 110, cancelled: 55, expired: 45 },
  { month: "Mar", existing: 1250, onHold: 280, newMembership: 240, rejoins: 120, cancelled: 60, expired: 50 },
  { month: "Apr", existing: 1300, onHold: 300, newMembership: 260, rejoins: 130, cancelled: 65, expired: 55 },
  { month: "May", existing: 1350, onHold: 320, newMembership: 280, rejoins: 140, cancelled: 70, expired: 60 },
  { month: "Jun", existing: 1400, onHold: 340, newMembership: 300, rejoins: 150, cancelled: 75, expired: 65 },
]

export default function MemberGraph() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Member Graph as at End of Month</h3>
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-sm"></div>
          <span className="text-muted-foreground">Existing Members</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-300 rounded-sm"></div>
          <span className="text-muted-foreground">On Hold</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-200 rounded-sm"></div>
          <span className="text-muted-foreground">New Membership</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-100 rounded-sm"></div>
          <span className="text-muted-foreground">Rejoins</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-300 rounded-sm"></div>
          <span className="text-muted-foreground">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
          <span className="text-muted-foreground">Expired</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0 0)" />
          <XAxis dataKey="month" tick={{ fill: "oklch(0.68 0 0)", fontSize: 12 }} />
          <YAxis tick={{ fill: "oklch(0.68 0 0)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.22 0 0)",
              border: "1px solid oklch(0.30 0 0)",
              borderRadius: "6px",
              color: "oklch(0.98 0 0)",
            }}
          />
          <Bar dataKey="existing" stackId="a" fill="oklch(0.6 0.15 280)" />
          <Bar dataKey="onHold" stackId="a" fill="oklch(0.65 0.12 270)" />
          <Bar dataKey="newMembership" stackId="a" fill="oklch(0.70 0.10 260)" />
          <Bar dataKey="rejoins" stackId="a" fill="oklch(0.75 0.08 250)" />
          <Bar dataKey="cancelled" stackId="a" fill="oklch(0.60 0.18 20)" />
          <Bar dataKey="expired" stackId="a" fill="oklch(0.68 0.14 10)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
