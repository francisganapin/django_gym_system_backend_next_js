"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Download, Filter } from "lucide-react"

export default function ReportTillPage() {
  const reports = [
    { date: "2024-04-15", transactions: 45, revenue: 2850, fees: 150 },
    { date: "2024-04-14", transactions: 38, revenue: 2420, fees: 120 },
    { date: "2024-04-13", transactions: 52, revenue: 3100, fees: 180 },
    { date: "2024-04-12", transactions: 41, revenue: 2600, fees: 140 },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Reports & Till</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="text-foreground border-input-border bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card className="p-6 bg-card border-card-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-input-border">
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Transactions</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Revenue</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Fees</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Net</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <tr key={index} className="border-b border-input-border hover:bg-input/50">
                    <td className="py-3 px-4 text-foreground">{report.date}</td>
                    <td className="py-3 px-4 text-foreground">{report.transactions}</td>
                    <td className="py-3 px-4 text-green-400">${report.revenue}</td>
                    <td className="py-3 px-4 text-foreground">${report.fees}</td>
                    <td className="py-3 px-4 text-green-400 font-semibold">${report.revenue - report.fees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
