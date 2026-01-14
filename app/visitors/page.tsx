"use client"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react";

// Define the API response type
interface WeeklySummary {
  day: string;
  count: number;
}

// Fallback data when API is unavailable
const fallbackData: WeeklySummary[] = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 52 },
  { day: "Wed", count: 49 },
  { day: "Thu", count: 63 },
  { day: "Fri", count: 58 },
  { day: "Sat", count: 72 },
  { day: "Sun", count: 68 },
];

export default function VisitorsPage() {
  const [chartData, setChartData] = useState<WeeklySummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Use API data if available, otherwise use fallback
  const displayData = chartData.length > 0 ? chartData : fallbackData;

  useEffect(() => {
    fetchData();  // Run once when component loads
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://127.0.0.1:8000/api/login-records/weekly-summary/`);

      if (!response.ok) {
        throw new Error('Network response Failed');
      }

      const data: WeeklySummary[] = await response.json();
      setChartData(data);

    } catch (error) {
      console.error('Error fetching weekly summary:', error);
    } finally {
      setLoading(false);
    }
  };
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
              <BarChart data={displayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
                <Legend />
                <Bar dataKey="count" fill="#22c55e" name="Visitors" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  )
}
