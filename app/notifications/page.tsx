"use client"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Bell, MessageCircle, Trash2, CheckCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: number
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "message" | "alert" | "warning"
  chatMessages?: ChatMessage[]
}

interface ChatMessage {
  id: number
  sender: "boss" | "you"
  text: string
  time: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Check Inventory Levels",
      message: "Please review our protein powder stock. We're running low and need to reorder ASAP.",
      timestamp: "Today at 10:30 AM",
      read: false,
      type: "alert",
      chatMessages: [
        { id: 1, sender: "boss", text: "Hi, can you check the protein powder inventory?", time: "10:25 AM" },
        { id: 2, sender: "you", text: "Sure, let me check the stock page right now.", time: "10:28 AM" },
        {
          id: 3,
          sender: "boss",
          text: "Great! We're running low on stock. We need to reorder ASAP.",
          time: "10:30 AM",
        },
      ],
    },
    {
      id: 2,
      title: "Monthly Revenue Report",
      message: "Great performance this month! Revenue is up 15% compared to last month.",
      timestamp: "Today at 9:15 AM",
      read: false,
      type: "message",
      chatMessages: [
        { id: 1, sender: "boss", text: "I just reviewed the sales report. Excellent work!", time: "9:10 AM" },
        { id: 2, sender: "boss", text: "Revenue is up 15% this month. Best performance yet!", time: "9:12 AM" },
        { id: 3, sender: "you", text: "That's amazing! The new promotions really helped.", time: "9:14 AM" },
        { id: 4, sender: "boss", text: "Keep up the great work.", time: "9:15 AM" },
      ],
    },
    {
      id: 3,
      title: "New Member Promotion",
      message: "Let's run a promotion for new members: 20% off first month.",
      timestamp: "Yesterday at 5:45 PM",
      read: true,
      type: "message",
      chatMessages: [
        { id: 1, sender: "boss", text: "I want to launch a new member promotion", time: "5:40 PM" },
        { id: 2, sender: "boss", text: "How about 20% off for the first month?", time: "5:42 PM" },
        { id: 3, sender: "you", text: "That sounds good. I'll update the system.", time: "5:43 PM" },
        { id: 4, sender: "boss", text: "Perfect! Send it out to all prospects. Thanks!", time: "5:45 PM" },
      ],
    },
  ])

  const [expandedChat, setExpandedChat] = useState<number | null>(null)
  const [showSendMessage, setShowSendMessage] = useState(false)
  const [messageText, setMessageText] = useState("")

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const sendMessage = () => {
    if (messageText.trim()) {
      const now = new Date()
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      const newNotification: Notification = {
        id: notifications.length + 1,
        title: "Your Message",
        message: messageText,
        timestamp: "Just now",
        read: true,
        type: "message",
        chatMessages: [
          {
            id: 1,
            sender: "you",
            text: messageText,
            time: timeStr,
          },
        ],
      }
      setNotifications([newNotification, ...notifications])
      setMessageText("")
      setShowSendMessage(false)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30"
      case "warning":
        return "bg-red-500/10 text-red-500 border-red-500/30"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/30"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <Bell className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground">Messages from Boss</h1>
                  </div>
                  <p className="text-foreground/60">
                    {unreadCount > 0 ? `${unreadCount} unread message(s)` : "All messages read"}
                  </p>
                </div>
                <Button
                  onClick={() => setShowSendMessage(true)}
                  className="gap-2 bg-accent hover:bg-accent/90 text-background"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </Button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/60 text-lg">No messages yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id}>
                      <div
                        className={`bg-card rounded-lg border ${notification.read ? "border-sidebar-border" : "border-accent bg-card/50"
                          } p-6 hover:border-accent transition-colors cursor-pointer`}
                        onClick={() => setExpandedChat(expandedChat === notification.id ? null : notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Type Badge */}
                          <div className={`p-3 rounded-lg border ${getTypeColor(notification.type)} flex-shrink-0`}>
                            <MessageCircle className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3
                                  className={`font-bold ${notification.read ? "text-foreground/70" : "text-foreground"}`}
                                >
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-foreground/50">Your Boss</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-2" />
                              )}
                            </div>
                            <p
                              className={`text-sm ${notification.read ? "text-foreground/50" : "text-foreground/70"} mb-3`}
                            >
                              {notification.message}
                            </p>
                            <p className="text-xs text-foreground/40">{notification.timestamp}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="gap-2 bg-transparent"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                              className="gap-2 bg-transparent hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages Section */}
                      {expandedChat === notification.id && notification.chatMessages && (
                        <div className="bg-card border border-sidebar-border rounded-lg mt-2 p-6">
                          <div className="space-y-4">
                            {notification.chatMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === "you" ? "bg-accent text-background" : "bg-sidebar text-foreground"
                                    }`}
                                >
                                  <p className="text-sm">{msg.text}</p>
                                  <p
                                    className={`text-xs mt-1 ${msg.sender === "you" ? "text-background/70" : "text-foreground/50"}`}
                                  >
                                    {msg.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Send Message Modal */}
          {showSendMessage && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card border border-sidebar-border rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Send Message to Boss</h2>
                  <button
                    onClick={() => setShowSendMessage(false)}
                    className="text-foreground/60 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-sidebar text-foreground placeholder:text-foreground/50 border border-sidebar-border rounded-lg p-3 mb-4 min-h-24 focus:outline-none focus:border-accent"
                />
                <div className="flex gap-3">
                  <Button onClick={() => setShowSendMessage(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={sendMessage} className="flex-1 gap-2 bg-accent hover:bg-accent/90 text-background">
                    <Send className="w-4 h-4" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
