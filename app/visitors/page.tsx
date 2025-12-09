"use client"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { date: "Mon", visitors: 45 },
  { date: "Tue", visitors: 52 },
  { date: "Wed", visitors: 48 },
  { date: "Thu", visitors: 61 },
  { date: "Fri", visitors: 75 },
  { date: "Sat", visitors: 89 },
  { date: "Sun", visitors: 42 },
]

export default function VisitorsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Visitors</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-card border-card-border">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">47</p>
            </Card>
            <Card className="p-4 bg-card border-card-border">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">412</p>
            </Card>
            <Card className="p-4 bg-card border-card-border">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-2xl font-bold text-foreground">1,847</p>
            </Card>
            <Card className="p-4 bg-card border-card-border">
              <p className="text-sm text-muted-foreground">Average Daily</p>
              <p className="text-2xl font-bold text-foreground">59</p>
            </Card>
          </div>

          <Card className="p-6 bg-card border-card-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Weekly Visitor Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
                <Bar dataKey="visitors" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
