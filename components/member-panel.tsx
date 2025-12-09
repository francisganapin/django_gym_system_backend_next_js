"use client"

import { ChevronLeft, Check, Calendar, User, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MemberPanelProps {
  onClose: () => void
}

export default function MemberPanel({ onClose }: MemberPanelProps) {
  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-foreground hover:bg-muted">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
          <Check className="w-4 h-4" />
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted mb-4 flex items-center justify-center">
          <span className="text-2xl text-muted-foreground">?</span>
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No Member Selected</h2>
        <p className="text-sm text-muted-foreground">
          Select a member from the Find Member page or Member Portal to view their details
        </p>
      </div>

      {/* Action Buttons */}
      {/* Removed as part of the update */}

      {/* Details Tab */}
      {/* Removed as part of the update */}

      {/* Bottom Tabs */}
      <div className="border-t border-border p-4">
        <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground text-center">
          <button className="py-2 text-foreground border-b-2 border-accent">
            <User className="w-4 h-4 mx-auto mb-1" />
            Details
          </button>
          <button className="py-2 hover:text-foreground">
            <Users className="w-4 h-4 mx-auto mb-1" />
            Membership
          </button>
          <button className="py-2 hover:text-foreground">
            <MessageSquare className="w-4 h-4 mx-auto mb-1" />
            Communication
          </button>
          <button className="py-2 hover:text-foreground">
            <Calendar className="w-4 h-4 mx-auto mb-1" />
            Bookings
          </button>
        </div>
      </div>
    </div>
  )
}
