"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Shield, Bell, Lock } from "lucide-react"

export default function MyAccountPage() {
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!")
      return
    }
    alert("✓ Password changed successfully!")
    setPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">My Account</h1>

          <div className="max-w-2xl space-y-6">
            {/* Account Info */}
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Account Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Email Address</label>
                  <p className="text-foreground font-medium mt-1">curtis@gymmaster.com</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Account Type</label>
                  <p className="text-foreground font-medium mt-1">Administrator</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Account Status</label>
                  <p className="text-green-500 font-medium mt-1">✓ Active</p>
                </div>
              </div>
            </Card>

            {/* Change Password */}
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Change Password</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Current Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-input text-foreground rounded border border-input-border focus:outline-none"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-input text-foreground rounded border border-input-border focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-input text-foreground rounded border border-input-border focus:outline-none"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button onClick={handleChangePassword} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Update Password
                </Button>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-card border-card-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-foreground">Email notifications for new members</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-foreground">SMS alerts for expired memberships</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-foreground">Daily revenue reports</span>
                </label>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
