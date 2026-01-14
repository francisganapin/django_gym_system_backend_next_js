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
  first_name: string
  last_name: string
  email: string
  member_id: string
  membershipType: string
  expiry_date: string
  image: string
  status: "active" | "expired"
}

export default function LoginPortalPage() {
  const [memberId, setMemberId] = useState("")
  const [checkedInMember, setCheckedInMember] = useState<CheckInMember | null>(null)
  const [error, setError] = useState("")
  const [checkInHistory, setCheckInHistory] = useState<Array<{ name: string; time: string; status: string }>>([])

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCheckedInMember(null)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/member_portal?member_id=${memberId.toUpperCase()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Member ID not Found. Please check')
      }

      const member = await response.json();

      const expiryDate = new Date(member.expiry_date);
      const today = new Date();
      const isExpired = expiryDate < today;

      const memberData: CheckInMember = {
        ...member,
        status: isExpired ? 'expired' : "active",
      };
      setCheckedInMember(memberData);

      const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      setCheckInHistory((prev) => [
        { name: member.name, time: currentTime, status: isExpired ? "Expired" : "Active" },
        ...prev.slice(0, 9),
      ]);

      setMemberId('');
    } catch (err: any) {
      setError(err.message || "An error")
    }
  };

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
                  className={`p-6 rounded-lg border-2 ${checkedInMember.status === "active"
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-red-500/10 border-red-500/50"
                    }`}
                >
                  {/* Member Photo - Centered at Top */}
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={checkedInMember.image}
                      alt={`${checkedInMember.first_name} ${checkedInMember.last_name}`}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white/20 mb-3"
                    />
                    <div className="flex items-center gap-2">
                      {checkedInMember.status === "active" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <h3 className="text-lg font-bold text-foreground">
                        {checkedInMember.first_name} {checkedInMember.last_name}
                      </h3>
                    </div>
                    <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold uppercase ${checkedInMember.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                      }`}>
                      {checkedInMember.status === "active" ? "✓ Active" : "✗ Expired"}
                    </span>
                  </div>

                  {/* Member Details - Aligned Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Member ID</p>
                      <p className="text-sm font-medium text-foreground">{checkedInMember.member_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">{checkedInMember.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Expiration Date</p>
                      <p className={`text-sm font-bold ${checkedInMember.status === "active" ? "text-green-400" : "text-red-400"
                        }`}>
                        {new Date(checkedInMember.expiry_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Membership Type</p>
                      <p className="text-sm font-medium text-foreground">{checkedInMember.membershipType || "Standard"}</p>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  {checkedInMember.status === "active" && (
                    <p className="text-sm text-green-400 mt-4 text-center">✓ Attendance marked. Welcome to the gym!</p>
                  )}
                  {checkedInMember.status === "expired" && (
                    <p className="text-sm text-red-400 mt-4 text-center">✗ Membership expired. Please renew to continue.</p>
                  )}
                </div>
              )}
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
