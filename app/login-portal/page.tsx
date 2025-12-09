"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

interface CheckInMember {
  id: string
  name: string
  email: string
  membershipType: string
  expirationDate: string
  status: "active" | "expired"
}

const mockMembers: Record<string, CheckInMember> = {
  ID001: {
    id: "ID001",
    name: "Veronica Mars",
    email: "veronica@example.com",
    membershipType: "Premium Monthly",
    expirationDate: "2025-03-15",
    status: "active",
  },
  ID002: {
    id: "ID002",
    name: "John Doe",
    email: "john@example.com",
    membershipType: "Standard Monthly",
    expirationDate: "2024-12-01",
    status: "expired",
  },
  ID003: {
    id: "ID003",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    membershipType: "Premium Monthly",
    expirationDate: "2025-05-20",
    status: "active",
  },
  ID004: {
    id: "ID004",
    name: "Mike Wilson",
    email: "mike@example.com",
    membershipType: "Standard Monthly",
    expirationDate: "2025-01-30",
    status: "active",
  },
}

export default function LoginPortalPage() {
  const [memberId, setMemberId] = useState("")
  const [checkedInMember, setCheckedInMember] = useState<CheckInMember | null>(null)
  const [error, setError] = useState("")
  const [checkInHistory, setCheckInHistory] = useState<Array<{ name: string; time: string; status: string }>>([])

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCheckedInMember(null)

    const member = mockMembers[memberId.toUpperCase()]

    if (!member) {
      setError("Member ID not found. Please check and try again.")
      return
    }

    const expiryDate = new Date(member.expirationDate)
    const today = new Date()
    const isExpired = expiryDate < today
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const memberData: CheckInMember = {
      ...member,
      status: isExpired ? "expired" : "active",
    }

    setCheckedInMember(memberData)

    const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    setCheckInHistory((prev) => [
      { name: member.name, time: currentTime, status: isExpired ? "Expired" : "Active" },
      ...prev.slice(0, 9),
    ])

    // Reset input
    setMemberId("")
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-card-border p-4">
          <h1 className="text-2xl font-bold text-foreground">GymMaster - Member Check-In</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            {/* Check-In Card */}
            <Card className="p-8 bg-card border-card-border mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Scan or Enter Member ID</h2>

              <form onSubmit={handleCheckIn} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Member ID Card</label>
                  <Input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Enter member ID (e.g., ID001)"
                    autoFocus
                    className="bg-input border-input-border text-foreground text-lg p-3"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Try: ID001, ID002, ID003, ID004</p>
                </div>

                {error && (
                  <Alert className="bg-red-500/20 border-red-500/50">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-400">{error}</p>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg"
                >
                  Check In
                </Button>
              </form>

              {/* Member Status Display */}
              {checkedInMember && (
                <div
                  className={`p-6 rounded-lg border-2 ${
                    checkedInMember.status === "active"
                      ? "bg-green-500/10 border-green-500/50"
                      : "bg-red-500/10 border-red-500/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div>
                      {checkedInMember.status === "active" ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{checkedInMember.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{checkedInMember.membershipType}</p>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium text-foreground">{checkedInMember.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Member ID</p>
                          <p className="text-sm font-medium text-foreground">{checkedInMember.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Expiration Date</p>
                          <p
                            className={`text-sm font-bold ${
                              checkedInMember.status === "active" ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {new Date(checkedInMember.expirationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p
                            className={`text-sm font-bold uppercase ${
                              checkedInMember.status === "active" ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {checkedInMember.status === "active" ? "✓ Active" : "✗ Expired"}
                          </p>
                        </div>
                      </div>

                      {checkedInMember.status === "active" && (
                        <p className="text-xs text-green-400 mt-4">✓ Attendance marked. Welcome to the gym!</p>
                      )}
                      {checkedInMember.status === "expired" && (
                        <p className="text-xs text-red-400 mt-4">✗ Membership expired. Please renew to continue.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Check-In History */}
            {checkInHistory.length > 0 && (
              <Card className="p-6 bg-card border-card-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Today's Check-Ins</h3>
                <div className="space-y-2">
                  {checkInHistory.map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            record.status === "Active" ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{record.name}</p>
                          <p className="text-xs text-muted-foreground">{record.time}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          record.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
