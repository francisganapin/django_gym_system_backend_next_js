"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import MemberStats from "@/components/member-stats"
import MemberChart from "@/components/member-chart"
import MemberGraph from "@/components/member-graph"
import { Member, PaginatedResponse } from "./member-portal/types"
export default function Home() {




  const [members, setMembers] = useState<Member[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false);
  const [totalMember, setTotalMembers] = useState<number>(0)
  const [countExpired, setCountExpired] = useState<number>(0)
  const [countActive, setCountActive] = useState<number>(0)






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
              <MemberStats
                title="Total Members"
                value={totalMember.toString()}
                subtitle={`${countActive} Active Members`}
                color="neutral"
              />
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
                value="0"
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

          </div>

        </div>
      </div>
    </div>
  )
}
