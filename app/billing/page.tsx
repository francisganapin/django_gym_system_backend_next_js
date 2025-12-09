"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Upload, QrCode, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleQRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setQrCode(event.target?.result as string)
        setSaved(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveTemplates = () => {
    if (qrCode) {
      localStorage.setItem(
        "paymentTemplates",
        JSON.stringify({
          qrCode,
          timestamp: new Date().toISOString(),
        }),
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Billing & Payment Templates</h1>
                <p className="text-foreground/60">Configure your QR code for payment processing</p>
              </div>

              {saved && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">Payment templates saved successfully!</span>
                </div>
              )}

              <div className="bg-card rounded-lg border border-sidebar-border p-6 max-w-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <QrCode className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">QR Code Payment</h2>
                    <p className="text-sm text-foreground/60">Upload your payment QR code</p>
                  </div>
                </div>

                <div className="mb-6">
                  {qrCode ? (
                    <div className="w-full h-64 bg-sidebar rounded-lg p-4 flex items-center justify-center border-2 border-blue-500/30">
                      <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-sidebar rounded-lg border-2 border-dashed border-sidebar-border flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-foreground/40 mx-auto mb-2" />
                        <p className="text-foreground/60 text-sm">No QR code uploaded</p>
                      </div>
                    </div>
                  )}
                </div>

                <label className="w-full">
                  <input type="file" accept="image/*" onChange={handleQRUpload} className="hidden" />
                  <Button className="w-full gap-2 cursor-pointer bg-transparent" variant="outline">
                    <Upload className="w-4 h-4" />
                    Upload QR Code
                  </Button>
                </label>
              </div>

              <div className="mt-8 flex justify-start">
                <Button onClick={handleSaveTemplates} className="gap-2" disabled={!qrCode}>
                  <Save className="w-4 h-4" />
                  Save Payment Template
                </Button>
              </div>

              {/* Documentation Section */}
              <div className="mt-12 pt-8 border-t border-sidebar-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Documentation</h2>

                <div className="bg-card rounded-lg border border-sidebar-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">QR Code Setup</h3>
                  <ul className="space-y-2 text-sm text-foreground/70">
                    <li className="flex gap-2">
                      <span className="text-accent font-bold">1.</span>
                      <span>
                        Generate a payment QR code from your payment processor (for both QR Code and GCash payments)
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent font-bold">2.</span>
                      <span>Click "Upload QR Code" and select your QR code image</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent font-bold">3.</span>
                      <span>Review the preview and click "Save Payment Template"</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-accent font-bold">4.</span>
                      <span>
                        Your QR code will now appear in Point of Sale checkout for both QR Code and GCash payments
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
