"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Member, PaginatedResponse } from "./types"
import { Search, Eye, Edit2, Send, X } from "lucide-react"



export default function MemberPortalPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false);
  const [totalMember, setTotalMembers] = useState<number>(0)
  const [countExpired, setCountExpired] = useState<number>(0)
  const [countActive, setCountActive] = useState<number>(0)


  const today = new Date();

  const fetchMembers = async (url: string = 'http://127.0.0.1:8000/api/member_portal') => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed Network response');

      const data: PaginatedResponse<Member> = await response.json();
      setMembers(data.results);
      setNextPage(data.next);
      setCurrentPage(data.current_page)
      setTotalPages(data.total_page)
      setPrevPage(data.previous);
      setTotalMembers(data.count)
      setCountExpired(data.count_expired)
      setCountActive(data.count_active)
      setLoading(false);
    } catch (error) {
      console.log('Error fetching members', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);



  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMember, setSelectedMember] = useState<(typeof members)[0] | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<"view" | "update" | "sms">("view")
  const [newExpiryDate, setNewExpiryDate] = useState<string>("")
  const [selectedSmsOption, setSelectedSmsOption] = useState<"renewal" | "urgent" | "expired">("renewal")

  const filteredMembers = members.filter(
    (member) =>
      member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.id.toString().includes(searchTerm.toLowerCase()),
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
      renewal: `Hi ${selectedMember.first_name}, your GymMaster membership expires on ${selectedMember.expiry_date}. Renew now to continue enjoying unlimited access! 💪`,
      urgent: `${selectedMember.first_name}! Your membership expires soon (${selectedMember.expiry_date}). Renew today and get 20% OFF this month only! Don't miss out! 🏋️`,
      expired: `Hi ${selectedMember.first_name}, your GymMaster membership has expired. Re-activate now and get back to your fitness goals! Come visit us! 🔥`,
    }
    return messages[selectedSmsOption]
  }

  const handleUpdateSubscription = async () => {
    if (!selectedMember) return

    if (!newExpiryDate) {
      alert('Please select a new expiry date');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/member_portal/${selectedMember.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiry_date: newExpiryDate,
          status: 'Active',
          paid: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      await fetchMembers();
      alert(`Subscription updated for ${selectedMember.first_name}! New expiry: ${newExpiryDate}`);
      setShowModal(false);
      setNewExpiryDate('');
    } catch (error) {
      console.error('Error updating', error);
      alert('Failed to update subcription.Please try again');
    }
  };


  const totalRevenue = members.filter((m) => m.paid).reduce((sum, m) => sum + (m.monthly_fee || 0), 0)

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
                <p className="text-2xl font-bold text-foreground">{totalMember}</p>
              </Card>
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-500">{countActive}</p>
              </Card>
              <Card className="p-4 bg-card border-card-border">
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-500">{countExpired}</p>
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

            <div className="flex items-center justify-between p-4 border-b border-card-border bg-background/50">

              {/* Pagination Controls */}
              <div className="flex items-center justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => prevPage && fetchMembers(prevPage)}
                  disabled={!prevPage || loading}
                >
                  Previous
                </Button>

                <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => nextPage && fetchMembers(nextPage)}
                  disabled={!nextPage || loading}
                >
                  Next
                </Button>
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-card-border bg-background/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Member ID</th>
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
                      <td className="px-6 py-4 text-sm text-foreground font-medium">{member.member_id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {member.first_name} {member.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.membership}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{member.expiry_date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${member.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            }`}
                        >
                          {member.status === "Active" ? "Active" : "Expired"}
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
                            alt={selectedMember.first_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">ID</p>
                            <p className="text-foreground font-semibold">{selectedMember.id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Member ID</p>
                            <p className="text-foreground font-semibold">{selectedMember.member_id}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">First Name</p>
                              <p className="text-foreground">{selectedMember.first_name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">Last Name</p>
                              <p className="text-foreground">{selectedMember.last_name}</p>
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
                          <p className="text-foreground">{selectedMember.phone_number}</p>
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
                          <p className="text-foreground">{selectedMember.join_date}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground uppercase">Expiration Date</p>
                          <p
                            className={`text-lg font-bold ${selectedMember.status === "active" ? "text-green-500" : "text-red-500"
                              }`}
                          >
                            {selectedMember.expiry_date}
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
                            {selectedMember.first_name} {selectedMember.last_name}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current Expiry:{" "}
                          <span className="text-foreground font-semibold">{selectedMember.expiry_date}</span>
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="block">
                          <p className="text-sm font-semibold text-foreground mb-2">Select New Expiry Date:</p>
                          <input
                            type="date"
                            value={newExpiryDate}
                            onChange={(e) => setNewExpiryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-input border border-input-border text-foreground p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </label>
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
                        Sending to: <span className="text-foreground font-semibold">{selectedMember.phone_number}</span>
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
                          alert(`✓ SMS sent to ${selectedMember.phone_number}!`)
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
