"use client"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { BookOpen, Video, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HelpSupportPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  const documentationSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of using GymMaster dashboard",
      topics: ["Dashboard Overview", "Member Management", "Navigation Guide"],
      content: `
        Getting Started Guide:

        Welcome to GymMaster Dashboard! This comprehensive gym management system helps you handle all aspects of your business from member management to sales processing.

        Dashboard Overview:
        The main dashboard displays key metrics including total members, active members, cancellations, new members, visitors, and online bookings. Charts show member trends and visitor history over time.

        Main Features:
        • Home: Central dashboard with analytics and member overview
        • Add Member: Register new gym members with their details
        • Find Member: Search and locate members in the system
        • Visitors: Track daily gym visits and attendance
        • Schedule: Manage class schedules and trainer assignments
        • Point of Sale: Process product sales and payments
        • Reports: Generate revenue and membership analytics
        • Task & Stock: Manage gym tasks and inventory

        Navigation:
        Use the left sidebar to navigate between different sections. The top header shows search functionality, user profile, and settings. All pages maintain consistent design for easy navigation.
      `,
    },
    {
      title: "Member Management",
      description: "Add, edit, and manage gym members",
      topics: ["Adding New Members", "Updating Subscriptions", "Member Check-in", "SMS Notifications"],
      content: `
        Member Management Guide:

        Adding New Members:
        1. Click "Add Member" in the sidebar
        2. Fill in member details: first name, last name, age, gender, location
        3. Select membership type (Monthly, Quarterly, Semi-Annual, Annual)
        4. Add member photo/ID card image
        5. Click Save to create the member profile

        Member Portal:
        Access the Member Portal to view all registered members. Each member shows:
        - Member ID and full details
        - Membership type and expiration date
        - Active or expired status
        - Payment status

        Updating Subscriptions:
        For each member, click "Update Subscription" to:
        1. Select new subscription period (1, 3, 6, or 12 months)
        2. System automatically calculates pricing
        3. Extend their membership expiration date

        Check-in System (Login Portal):
        Members scan/enter their ID card at the login portal. System shows:
        - Green checkmark if membership is active
        - Red X if membership has expired
        - Automatically logs attendance in Visitors section

        SMS Notifications:
        Send SMS reminders to members with 3 pre-written templates:
        1. Renewal Reminder: Standard reminder to renew membership
        2. Urgent Renewal (with discount): Encourage renewal with special offer
        3. Expired Notice: Notify member their membership has expired

        To send SMS: Click "Send SMS" next to a member, select message template, and confirm.
      `,
    },
    {
      title: "Point of Sale",
      description: "Process transactions and payments",
      topics: ["Adding Products", "Processing Sales", "Payment Methods", "Transaction History"],
      content: `
        Point of Sale (POS) Guide:

        Processing Sales:
        1. Access Point of Sale from the sidebar
        2. Select products from the available items (protein powder, water bottles, towels, etc.)
        3. Add quantity for each item
        4. Items appear in the cart with automatic total calculation

        Payment Methods:
        The system supports three payment methods:
        • Cash: Direct cash payment
        • QR Code: Customer scans a QR code for payment (configured in Billing)
        • GCash: Mobile wallet payment using GCash QR (configured in Billing)

        Processing Transactions:
        1. Review items in cart
        2. Click "Proceed to Checkout"
        3. Select payment method
        4. For QR/GCash: Display QR code to customer, they complete payment
        5. Click "Confirm Payment Received"
        6. System shows green "PAID" confirmation
        7. Transaction automatically recorded

        Currency:
        All prices and totals are displayed in Philippine Peso (₱)

        Transaction History:
        View past transactions showing:
        - Date and time
        - Items purchased with quantities
        - Total amount
        - Payment method used
        - Customer information

        Total Revenue:
        Dashboard automatically calculates and displays total revenue from all transactions.
      `,
    },
    {
      title: "Reports & Analytics",
      description: "View and analyze business metrics",
      topics: ["Revenue Reports", "Member Analytics", "Visitor Tracking", "Monthly Statistics"],
      content: `
        Reports & Analytics Guide:

        Dashboard Analytics:
        The home dashboard displays:
        • Total Members: Current active membership count
        • Current Cancellations: Members who cancelled this period
        • New Members: Recently joined members
        • Visitors This Month: Monthly gym visits
        • Online Bookings: Class reservations
        • New Prospects: Potential members

        Charts:
        • Member Changes Chart: Shows trends in new members, prospects, and cancellations
        • Member Graph: Displays member status breakdown (existing, on hold, new, rejoins, cancelled, expired)
        • Visit History: Tracks gym visits by date

        Report & Till Section:
        Access detailed reports showing:
        - Daily/Monthly revenue breakdown
        - Transaction count and average transaction value
        - Payment method distribution
        - Member growth trends
        - Income forecasting

        Metrics Interpretation:
        - Green indicators show positive trends or active status
        - Red indicators highlight concerns like cancellations or expired memberships
        - Percentage changes show growth or decline compared to previous periods
      `,
    },
    {
      title: "Payment Setup",
      description: "Configure your payment methods",
      topics: ["QR Code Setup", "GCash Configuration", "Payment Templates"],
      content: `
        Payment Setup Guide:

        Accessing Payment Settings:
        1. Click Settings in top right corner
        2. Select "Billing" from the dropdown menu
        3. Configure your payment methods

        QR Code Setup:
        1. Generate a payment QR code from your payment processor
        2. Click "Upload QR Code"
        3. Select your QR code image (JPG or PNG)
        4. Review preview
        5. Click "Save Payment Templates"
        6. Your QR code will display during checkout when customers select QR payment

        GCash Setup:
        1. Enter your GCash account holder name
        2. Enter your GCash mobile number (09xxxxxxxxx format)
        3. Click "Save Payment Templates"
        4. GCash QR will be displayed during checkout
        5. System automatically generates GCash QR code

        Testing Payments:
        1. Process a test transaction in Point of Sale
        2. Select each payment method to verify setup
        3. Test that QR codes display correctly
        4. Confirm payment workflow completes successfully

        Best Practices:
        • Use high-quality QR code images
        • Keep account information updated
        • Test before accepting customer payments
        • Always confirm payment before marking as paid
        • Back up your payment configuration
      `,
    },
  ]

  const videoTutorials = [
    { title: "Dashboard Overview", duration: "5:30" },
    { title: "How to Add a New Member", duration: "3:45" },
    { title: "Member Check-in System", duration: "4:20" },
    { title: "Point of Sale Tutorial", duration: "6:15" },
    { title: "Payment Processing", duration: "5:00" },
    { title: "Managing Subscriptions", duration: "4:50" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-2">Help & Support</h1>
                <p className="text-foreground/60 text-lg">
                  Learn how to use GymMaster dashboard and manage your gym business
                </p>
              </div>

              {/* Video Tutorials Section */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <Video className="w-6 h-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Video Tutorials</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videoTutorials.map((video, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg border border-sidebar-border overflow-hidden hover:border-accent transition-colors"
                    >
                      {/* Video Placeholder */}
                      <div className="w-full h-40 bg-sidebar flex items-center justify-center">
                        <div className="text-center">
                          <Video className="w-12 h-12 text-red-500 mx-auto mb-2" />
                          <p className="text-foreground/60 text-sm">Video Placeholder</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                        <p className="text-sm text-foreground/60">{video.duration}</p>
                        <Button className="w-full mt-3 gap-2 bg-transparent" variant="outline">
                          <Video className="w-4 h-4" />
                          Watch Tutorial
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Documentation Section */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Documentation</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {documentationSections.map((section, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg border border-sidebar-border p-6 hover:border-accent transition-colors"
                    >
                      <h3 className="text-lg font-bold text-foreground mb-2">{section.title}</h3>
                      <p className="text-foreground/60 text-sm mb-4">{section.description}</p>
                      <ul className="space-y-2 mb-4">
                        {section.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="text-sm text-foreground/70 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                        className="w-full gap-2 bg-transparent"
                        variant="outline"
                      >
                        <BookOpen className="w-4 h-4" />
                        {expandedSection === index ? "Read Less" : "Read More"}
                        {expandedSection === index ? (
                          <ChevronUp className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Expanded Documentation Content */}
              {expandedSection !== null && (
                <section className="mb-12 bg-card rounded-lg border border-sidebar-border p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      {documentationSections[expandedSection].title}
                    </h2>
                    <button
                      onClick={() => setExpandedSection(null)}
                      className="text-foreground/60 hover:text-foreground transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">
                      {documentationSections[expandedSection].content}
                    </p>
                  </div>
                </section>
              )}

              {/* Contact Support Section */}
              <section className="bg-card rounded-lg border border-sidebar-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Need More Help?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Mail className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                      <p className="text-foreground/60 text-sm mb-3">Send us your questions anytime</p>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Mail className="w-4 h-4" />
                        support@gymmaster.com
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Phone className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                      <p className="text-foreground/60 text-sm mb-3">Call us for immediate assistance</p>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <Phone className="w-4 h-4" />
                        +63 912 345 6789
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-sidebar-border pt-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Send a Support Message</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full bg-sidebar border border-sidebar-border rounded-md px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-sidebar border border-sidebar-border rounded-md px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+63 912 345 6789"
                        className="w-full bg-sidebar border border-sidebar-border rounded-md px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <textarea
                        placeholder="Describe your issue or question..."
                        rows={4}
                        className="w-full bg-sidebar border border-sidebar-border rounded-md px-4 py-2 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent resize-none"
                      />
                    </div>
                    <Button className="w-full gap-2">
                      <Mail className="w-4 h-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
