"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Search, Eye, Edit2, Send, X } from "lucide-react"

export default function MemberPortalPage() {
  const [members, setMembers] = useState([
    {
      id: "MEM001",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+63 912 345 6789",
      age: 28,
      gender: "Male",
      location: "Makati, Manila",
      membership: "Premium",
      avail: "Gym + Classes",
      joinDate: "2024-01-15",
      expiryDate: "2024-12-31",
      status: "active",
      monthlyFee: 2500,
      paid: true,
      image: "/male-member-profile.jpg",
    },
    {
      id: "MEM002",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah@example.com",
      phone: "+63 923 456 7890",
      age: 32,
      gender: "Female",
      location: "BGC, Taguig",
      membership: "Standard",
      avail: "Gym Access",
      joinDate: "2024-02-20",
      expiryDate: "2024-11-20",
      status: "expired",
      monthlyFee: 1500,
      paid: true,
      image: "/female-member-profile.jpg",
    },
    {
      id: "MEM003",
      firstName: "Mike",
      lastName: "Chen",
      email: "mike@example.com",
      phone: "+63 934 567 8901",
      age: 25,
      gender: "Male",
      location: "Quezon City",
      membership: "Premium",
      avail: "Gym + Classes + PT",
      joinDate: "2024-03-10",
      expiryDate: "2025-01-10",
      status: "active",
      monthlyFee: 3500,
      paid: false,
      image: "/male-member-profile.jpg",
    },
    {
      id: "MEM004",
      firstName: "Emma",
      lastName: "Wilson",
      email: "emma@example.com",
      phone: "+63 945 678 9012",
      age: 29,
      gender: "Female",
      location: "Ortigas, Pasig",
      membership: "Basic",
      avail: "Gym Access",
      joinDate: "2024-04-05",
      expiryDate: "2025-02-05",
      status: "active",
      monthlyFee: 999,
      paid: true,
      image: "/female-member-profile.jpg",
    },
    {
      id: "MEM005",
      firstName: "David",
      lastName: "Martinez",
      email: "david@example.com",
      phone: "+63 956 789 0123",
      age: 35,
      gender: "Male",
      location: "Las Piñas",
      membership: "Premium",
      avail: "Gym + Classes",
      joinDate: "2024-01-25",
      expiryDate: "2024-10-25",
      status: "expired",
      monthlyFee: 2500,
      paid: false,
      image: "/male-member-profile.jpg",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"view" | "update" | "sms">("view")
  const [selectedDuration, setSelectedDuration] = useState<"1" | "3" | "6" | "12">("1")
  const [selectedSmsOption, setSelectedSmsOption] = useState<"renewal" | "urgent" | "expired">("renewal")

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (member: (typeof members)[0]) => {
    setSelectedMember(member)
    setModalType("view")
    setShowModal(true)
  }

  const handleUpdate = (member: (typeof members)[0]) => {
    setSelectedMember(member)
    setModalType("update")
    setShowModal(true)
  }

  const handleSendSms = (member: (typeof members)[0]) => {
    setSelectedMember(member)
    setModalType("sms")
    setShowModal(true)
  }

  const getSmsMessage = () => {
    if (!selectedMember) return ""
    const messages = {
      renewal: `Hi ${selectedMember.firstName}, your GymMaster membership expires on ${selectedMember.expiryDate}. Renew now to continue enjoying unlimited access! 💪`,
      urgent: `${selectedMember.firstName}! Your membership expires soon (${selectedMember.expiryDate}). Renew today and get 20% OFF this month only! Don't miss out! 🏋️`,
      expired: `Hi ${selectedMember.firstName}, your GymMaster membership has expired. Re-activate now and get back to your fitness goals! Come visit us! 🔥`,
    }
    return messages[selectedSmsOption]
  }

  const handleUpdateSubscription = () => {
    if (!selectedMember) return
    const durationMonths = Number.parseInt(selectedDuration)
    const newExpiryDate = new Date()
    newExpiryDate.setMonth(newExpiryDate.getMonth() + durationMonths)

    const updatedMembers = members.map((m) =>
      m.id === selectedMember.id
        ? {
            ...m,
            expiryDate: newExpiryDate.toISOString().split("T")[0],
            status: "active",
            paid: true,
          }
        : m,
    )
    setMembers(updatedMembers)
    alert(
      `✓ Subscription updated for ${selectedMember.firstName}! New expiry: ${newExpiryDate.toISOString().split("T")[0]}`,
    )
    setShowModal(false)
  }

  const activeMemberCount = members.filter((m) => m.status === "active").length
  const expiredMemberCount = members.filter((m) => m.status === "expired").length
  const totalRevenue = members.filter((m) => m.paid).reduce((sum, m) => sum + m.monthlyFee, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-4">Member Portal</h1>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-foreground">{members.length}</p>
              </Card>
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-500">{activeMemberCount}</p>
              </Card>
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-500">{expiredMemberCount}</p>
              </Card>
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-500">₱{totalRevenue.toLocaleString()}</p>
              </Card>
            </div>
          </div>

          <Card className="bg-card border-card-border">
            <div className="p-6 border-b border-card-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-input text-foreground placeholder:text-muted-foreground pl-10 pr-4 py-2 rounded-md text-sm border border-input-border focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border bg-background/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Membership</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-card-border hover:bg-background/50">
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{member.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.membership}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.expiryDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            member.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {member.status === "active" ? "Active" : "Expired"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(member)} className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleUpdate(member)} className="text-xs">
                            <Edit2 className="w-3 h-3 mr-1" />
                            Renew
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendSms(member)} className="text-xs">
                            <Send className="w-3 h-3 mr-1" />
                            SMS
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {showModal && selectedMember && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-card border-card-border max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {modalType === "view"
                        ? "Member Details"
                        : modalType === "update"
                          ? "Renew Subscription"
                          : "Send SMS"}
                    </h2>
                    <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {modalType === "view" && (
                    <div className="space-y-4">
                      <div className="flex gap-6">
                        <div className="w-32 h-32 rounded-lg overflow-hidden bg-input border border-input-border flex-shrink-0">
                          <img
                            src={selectedMember.image || "/placeholder.svg"}
                            alt={selectedMember.firstName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">ID</p>
                            <p className="text-foreground font-semibold">{selectedMember.id}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">First Name</p>
                              <p className="text-foreground">{selectedMember.firstName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">Last Name</p>
                              <p className="text-foreground">{selectedMember.lastName}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-card-border">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Age</p>
                          <p className="text-foreground">{selectedMember.age} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Gender</p>
                          <p className="text-foreground">{selectedMember.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Location</p>
                          <p className="text-foreground">{selectedMember.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Phone</p>
                          <p className="text-foreground">{selectedMember.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Email</p>
                          <p className="text-foreground text-sm">{selectedMember.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Membership</p>
                          <p className="text-foreground">{selectedMember.membership}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Services</p>
                          <p className="text-foreground">{selectedMember.avail}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase">Join Date</p>
                          <p className="text-foreground">{selectedMember.joinDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground uppercase">Expiration Date</p>
                          <p
                            className={`text-lg font-bold ${
                              selectedMember.status === "active" ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {selectedMember.expiryDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {modalType === "update" && (
                    <div className="space-y-4">
                      <div className="bg-input rounded-lg p-4 border border-input-border">
                        <p className="text-sm text-muted-foreground mb-2">
                          Renewing subscription for:{" "}
                          <span className="text-foreground font-semibold">
                            {selectedMember.firstName} {selectedMember.lastName}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current Expiry:{" "}
                          <span className="text-foreground font-semibold">{selectedMember.expiryDate}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">Select Duration:</p>
                        {[
                          { value: "1", label: "1 Month", price: 2500 },
                          { value: "3", label: "3 Months", price: 7200 },
                          { value: "6", label: "6 Months", price: 13500 },
                          { value: "12", label: "1 Year", price: 25000 },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-3 p-3 rounded border border-input-border cursor-pointer hover:bg-input"
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={option.value}
                              checked={selectedDuration === option.value}
                              onChange={(e) => setSelectedDuration(e.target.value as "1" | "3" | "6" | "12")}
                              className="w-4 h-4"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{option.label}</p>
                              <p className="text-xs text-muted-foreground">₱{option.price.toLocaleString()}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      <Button
                        onClick={handleUpdateSubscription}
                        className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
                      >
                        Confirm Renewal
                      </Button>
                    </div>
                  )}

                  {modalType === "sms" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Sending to: <span className="text-foreground font-semibold">{selectedMember.phone}</span>
                      </p>

                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">Choose Message:</p>
                        {[
                          {
                            value: "renewal",
                            label: "Renewal Reminder",
                            desc: "Regular reminder to renew membership",
                          },
                          {
                            value: "urgent",
                            label: "Urgent Renewal (Discount)",
                            desc: "Special offer to encourage renewal",
                          },
                          {
                            value: "expired",
                            label: "Expired Notice",
                            desc: "Notification that membership has expired",
                          },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-start gap-3 p-3 rounded border border-input-border cursor-pointer hover:bg-input"
                          >
                            <input
                              type="radio"
                              name="sms"
                              value={option.value}
                              checked={selectedSmsOption === (option.value as "renewal" | "urgent" | "expired")}
                              onChange={(e) => setSelectedSmsOption(e.target.value as "renewal" | "urgent" | "expired")}
                              className="w-4 h-4 mt-1"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{option.label}</p>
                              <p className="text-xs text-muted-foreground">{option.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="bg-input rounded-lg p-4 border border-input-border mt-4">
                        <p className="text-xs text-muted-foreground mb-2">Message Preview:</p>
                        <p className="text-sm text-foreground italic">{getSmsMessage()}</p>
                      </div>

                      <Button
                        onClick={() => {
                          alert(`✓ SMS sent to ${selectedMember.phone}!`)
                          setShowModal(false)
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6"
                      >
                        Send SMS
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
