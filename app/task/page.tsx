"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { CheckCircle, Circle, Trash2 } from "lucide-react"

export default function TaskPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Equipment Maintenance", completed: false, priority: "High", dueDate: "2024-04-20" },
    { id: 2, title: "Staff Training Session", completed: true, priority: "Medium", dueDate: "2024-04-15" },
    { id: 3, title: "Member Renewal Follow-up", completed: false, priority: "High", dueDate: "2024-04-18" },
    { id: 4, title: "Gym Cleaning Schedule", completed: true, priority: "Low", dueDate: "2024-04-16" },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Task</Button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 bg-card border-card-border flex items-center justify-between ${task.completed ? "opacity-60" : ""
                  }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => toggleTask(task.id)} className="text-primary hover:text-primary/80">
                    {task.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${task.priority === "High"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                  >
                    {task.priority}
                  </span>
                  <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
