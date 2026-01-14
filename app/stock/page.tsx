"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { AlertCircle } from "lucide-react"

export default function StockPage() {
  const inventory = [
    { id: 1, name: "Protein Powder", quantity: 45, reorderLevel: 20, status: "In Stock" },
    { id: 2, name: "Water Bottles", quantity: 8, reorderLevel: 15, status: "Low Stock" },
    { id: 3, name: "Towels", quantity: 120, reorderLevel: 50, status: "In Stock" },
    { id: 4, name: "Gloves", quantity: 3, reorderLevel: 10, status: "Critical" },
    { id: 5, name: "Pre-Workout", quantity: 32, reorderLevel: 20, status: "In Stock" },
    { id: 6, name: "Shakers", quantity: 67, reorderLevel: 30, status: "In Stock" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Stock</h1>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Add Stock</Button>
          </div>

          <Card className="p-6 bg-card border-card-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-input-border">
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Product</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Quantity</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-input-border hover:bg-input/50">
                    <td className="py-3 px-4 text-foreground">{item.name}</td>
                    <td className="py-3 px-4 text-foreground">{item.quantity}</td>
                    <td className="py-3 px-4 text-foreground">{item.reorderLevel}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.status === "Critical" && <AlertCircle className="w-4 h-4 text-red-500" />}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${item.status === "In Stock"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "Low Stock"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  )
}
