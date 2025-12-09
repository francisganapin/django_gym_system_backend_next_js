"use client"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import MemberStats from "@/components/member-stats"
import MemberChart from "@/components/member-chart"
import MemberGraph from "@/components/member-graph"
import VisitHistory from "@/components/visit-history"
import MemberPanel from "@/components/member-panel"

export default function Home() {
  const [selectedMember, setSelectedMember] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="flex-1 overflow-auto flex">
          {/* Left Panel - Charts and Stats */}
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MemberStats title="Current Members" value="430" subtitle="390 Active Members" color="neutral" />
              <MemberStats
                title="Cancellations"
                value="2"
                change="-40%"
                changeDirection="down"
                subtitle="Members cancelling between 01 Apr and 07 Apr"
                color="success"
              />
              <MemberStats
                title="New Members"
                value="5"
                change="-57%"
                changeDirection="down"
                subtitle="Joined since 01 Apr compared with 01 Mar to 07 Mar"
                color="danger"
              />
              <MemberStats
                title="Visitors This Month"
                value="83"
                change="-6%"
                changeDirection="down"
                subtitle="Visits from 01 Apr compared with 01 Mar to 07"
                color="danger"
              />
              <MemberStats
                title="Online Bookings This Month"
                value="68"
                change="17%"
                changeDirection="up"
                subtitle="Churn rate increased"
                color="success"
              />
              <MemberStats title="New Prospects This Month" value="32" subtitle="" color="success" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MemberChart />
              <MemberGraph />
            </div>

            {/* Visit History */}
            <VisitHistory />
          </div>

          {/* Right Panel - Member Details */}
          {selectedMember && <MemberPanel onClose={() => setSelectedMember(false)} />}
        </div>
      </div>
    </div>
  )
}
