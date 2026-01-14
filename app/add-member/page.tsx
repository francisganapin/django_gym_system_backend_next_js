"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Upload, X } from "lucide-react"


type MemberFormData = {
  firstName: string
  lastName: string
  email:string
  phone:string
  dateofBirth:string
  membershipType:string
  joinDate:string
  image:string | null
}


export default function AddMemberPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    membershipType: "standard",
    joinDate: new Date().toISOString().split("T")[0],
    image: null as string | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result as string }))
        setImageError(false);
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    // Also clear the hidden file input so HTML5 `required` validation works
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }



const [ImageError, setImageError] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!formData.image) {
        setImageError(true);
      return;
    }
  setImageError(false);

  try {
    // Enforce image required on submit (hidden input may skip native validation)
    
    // DRF expects application/json or multipart. We're sending JSON here.
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      // Backend model uses `phone_number` and `membership`
      phone_number: formData.phone,
      membership: formData.membershipType,
      // Omit unknown fields for this endpoint (date_of_birth, join_date, image)
    }

    const response = await fetch("http://127.0.0.1:8000/api/member_portal/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok){
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      throw new Error(errorText)
    }

    const data = await response.json()
    console.log(data)
    alert("Member added successfully!")
  } catch (err) {
    console.error(err)
  }
}


  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-6">Add New Member</h1>
            <Card className="p-6 bg-card border-card-border">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  {/* CHANGE 1: Removed error message from inside the label */}
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Member Photo
                  </label>
                  
                  {/* CHANGE 2: Added error message here as a separate element for better visibility */}
                  {ImageError && (
                    <p className="text-red-500 text-sm mb-2 font-medium">
                      ⚠ Photo is required. Please upload an image.
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {formData.image ? (
                      <div className="relative w-24 h-24">

                        <img
                          src={formData.image || "/placeholder.svg"}
                          alt="Member preview"
                          className="w-full h-full object-cover rounded-lg border border-input-border"
                        />
                        
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // CHANGE 3: Added red border to upload area when there's an error
                      <div className={`w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-input/50 ${
                        ImageError ? 'border-red-500' : 'border-input-border'
                      }`}>
                        <Upload className="w-6 h-6 text-foreground/50" />
                      </div>
                    )}
                    <div>
                      <label className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                        {/* CHANGE 4: Removed 'required' attribute because hidden inputs can't be focused by browser validation */}
                        {/* We're handling validation manually in handleSubmit with ImageError state instead */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-foreground/60 mt-2">JPG, PNG, or GIF</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                    <Input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="bg-input border-input-border text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                    <Input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className="bg-input border-input-border text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="bg-input border-input-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    required
                    className="bg-input border-input-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="bg-input border-input-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Membership Type</label>
                  <select
                    name="membershipType"
                    value={formData.membershipType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-input border border-input-border text-foreground rounded-md"
                  >
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Join Date</label>
                  <Input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    required
                    className="bg-input border-input-border text-foreground"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Add Member
                  </Button>
                  <Button type="reset" variant="outline" className="text-foreground border-input-border bg-transparent">
                    Clear
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}