"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

export default function FindMemberPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([
    {
      id: 1,
      name: "Veronica Mars",
      email: "veronica@example.com",
      phone: "+1234567890",
      membershipType: "Premium",
      joinDate: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1987654321",
      membershipType: "Standard",
      joinDate: "2024-03-20",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1111111111",
      membershipType: "VIP",
      joinDate: "2023-06-10",
      status: "Expired",
    },
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter results based on search term
    console.log("Searching for:", searchTerm)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">Find Member</h1>

          <Card className="p-6 bg-card border-card-border mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-input-border text-foreground flex-1"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            {results.map((member) => (
              <Card
                key={member.id}
                className="p-4 bg-card border-card-border hover:border-primary/50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.phone}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${member.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                    >
                      {member.status}
                    </span>
                    <p className="text-sm text-muted-foreground mt-2">
                      {member.membershipType} • Since {member.joinDate}
                    </p>
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
