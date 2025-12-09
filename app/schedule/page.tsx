"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

export default function SchedulePage() {
  const schedule = [
    { time: "06:00 AM", class: "Morning Yoga", trainer: "Alice", members: 12, room: "Studio A" },
    { time: "07:00 AM", class: "CrossFit", trainer: "Bob", members: 18, room: "Main Hall" },
    { time: "08:00 AM", class: "Zumba", trainer: "Carol", members: 15, room: "Studio B" },
    { time: "05:00 PM", class: "Spin Class", trainer: "David", members: 20, room: "Cycle Room" },
    { time: "06:00 PM", class: "Boxing", trainer: "Eve", members: 14, room: "Ring Area" },
    { time: "07:00 PM", class: "Pilates", trainer: "Frank", members: 10, room: "Studio A" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Class</Button>
          </div>

          <div className="space-y-3">
            {schedule.map((item, index) => (
              <Card key={index} className="p-4 bg-card border-card-border hover:border-primary/50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                    <h3 className="text-lg font-semibold text-foreground">{item.class}</h3>
                    <p className="text-sm text-muted-foreground">Trainer: {item.trainer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{item.members} Members</p>
                    <p className="text-xs text-muted-foreground bg-input px-2 py-1 rounded mt-2">{item.room}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
