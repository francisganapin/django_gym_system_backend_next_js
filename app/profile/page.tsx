"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"

export default function ProfilePage() {
  const profile = {
    name: "Curtis Johnson",
    email: "curtis@gymmaster.com",
    phone: "+63 912 345 6789",
    location: "Manila, Philippines",
    joinDate: "2023-01-15",
    role: "Admin Manager",
    image: "/male-professional-admin.jpg",
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">My Profile</h1>

          <div className="max-w-2xl">
            <Card className="bg-card border-card-border p-8">
              <div className="flex gap-8 mb-8">
                <div className="w-40 h-40 rounded-lg overflow-hidden bg-input border border-input-border flex-shrink-0">
                  <img
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold text-foreground mb-1">{profile.name}</h2>
                  <p className="text-lg text-muted-foreground mb-4">{profile.role}</p>
                  <Button className="w-32 bg-blue-500 hover:bg-blue-600 text-white">Edit Profile</Button>
                </div>
              </div>

              <div className="border-t border-card-border pt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Email</p>
                    <p className="text-foreground">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Phone</p>
                    <p className="text-foreground">{profile.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Location</p>
                    <p className="text-foreground">{profile.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase">Member Since</p>
                    <p className="text-foreground">{profile.joinDate}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
