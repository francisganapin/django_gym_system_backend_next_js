"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { Trash2, ShoppingCart, History, CreditCard, CheckCircle, X } from "lucide-react"

type CartItem = {
  id: number
  name: string
  price: number
  image: string
  qty: number
}

type Transaction = {
  id: number
  date: string
  items: CartItem[]
  total: number
  paymentMethod: string
  cashAmount?: number
  change?: number
}

type Product = {
  id: number
  name: string
  price: number
  image: string
}

export default function PointOfSalePage() {



  const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/Product') => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed Network Response');

      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }

  }



  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showGCashModal, setShowGCashModal] = useState(false)
  const [qrConfirmed, setQRConfirmed] = useState(false)
  const [gcashConfirmed, setGCashConfirmed] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "qr" | "gcash" | null>(null)
  const [paymentTemplates, setPaymentTemplates] = useState<any>({})
  const [cashAmount, setCashAmount] = useState<number | "">("")
  const [change, setChange] = useState<number>(0)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("paymentTemplates")
    if (saved) {
      try {
        const templates = JSON.parse(saved)
        setPaymentTemplates(templates)
      } catch (e) {
        console.error("Failed to load payment templates")
      }
    }

    const loadProducts = async () => {
      const data = await fetchProducts();
      if (data) {
        setProducts(data);
      }
    };
    loadProducts();
  }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const addToCart = (product: CartItem) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)))
    } else {
      setCart([...cart, { ...product, qty: 1 }])
    }
  }

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    if (cart.length === 0) return
    setShowPaymentModal(true)
  }

  const completePayment = (method: "cash" | "qr" | "gcash") => {
    if (method === "cash") {
      setSelectedPayment("cash")
      setCashAmount("")
      setChange(0)
      return
    }

    if (method === "qr") {
      setSelectedPayment("qr")
      setShowQRModal(true)
      setQRConfirmed(false)
      return
    }

    if (method === "gcash") {
      setSelectedPayment("gcash")
      setShowGCashModal(true)
      setGCashConfirmed(false)
      return
    }
  }

  const completeCashPayment = () => {
    if (cashAmount === "" || Number(cashAmount) < total) {
      alert("Insufficient payment amount")
      return
    }

    const changeAmount = Number(cashAmount) - total
    setChange(changeAmount)

    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toLocaleString(),
      items: [...cart],
      total: total,
      paymentMethod: "Cash",
      cashAmount: Number(cashAmount),
      change: changeAmount,
    }

    setTransactions([newTransaction, ...transactions])
    setCart([])
    setShowPaymentModal(false)
    setCashAmount("")
    setChange(0)
    alert(`Payment received! Change: ₱${changeAmount.toFixed(2)}`)
  }

  const confirmQRPayment = () => {
    setQRConfirmed(true)
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: total,
        paymentMethod: "QR Code",
      }

      setTransactions([newTransaction, ...transactions])
      setCart([])
      setShowPaymentModal(false)
      setShowQRModal(false)
      setQRConfirmed(false)
      alert(`Payment received via QR Code! ₱${total.toLocaleString()}`)
    }, 1500)
  }

  const confirmGCashPayment = () => {
    setGCashConfirmed(true)
    setTimeout(() => {
      const newTransaction = {
        id: transactions.length + 1,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: total,
        paymentMethod: "GCash",
      }

      setTransactions([newTransaction, ...transactions])
      setCart([])
      setShowPaymentModal(false)
      setShowGCashModal(false)
      setGCashConfirmed(false)
      alert(`Payment received via GCash! ₱${total.toLocaleString()}`)
    }, 1500)
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-foreground">Point of Sale</h1>
            <Button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {showHistory ? "Hide" : "Show"} History
            </Button>
          </div>

          {showHistory ? (
            <div className="space-y-4">
              <Card className="p-6 bg-card border-card-border">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                    <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-500">₱{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Average Sale</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₱{(totalRevenue / transactions.length).toFixed(0)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-card-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-card-border bg-background/50">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date & Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Items</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-card-border hover:bg-background/50">
                          <td className="px-6 py-4 text-sm text-foreground">{transaction.date}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {transaction.items.map((item) => item.name).join(", ")}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {transaction.items.reduce((sum, item) => sum + item.qty, 0)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-500">
                            ₱{transaction.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{transaction.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <Card className="p-6 bg-card border-card-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Available Products</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 bg-input border border-input-border rounded-lg hover:border-primary cursor-pointer transition-all"
                        onClick={() => addToCart({ ...product, qty: 1 })}
                      >
                        <div className="w-full h-24 rounded bg-background mb-3 overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-foreground text-sm">{product.name}</p>
                        <p className="text-sm text-green-500 font-semibold mt-2">₱{product.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6 bg-card border-card-border sticky top-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Cart is empty</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.qty} x ₱{item.price.toLocaleString()}
                            </p>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-input-border pt-3 mb-4">
                    <p className="text-lg font-bold text-foreground">Total: ₱{total.toLocaleString()}</p>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                  >
                    Checkout
                  </Button>
                </Card>
              </div>
            </div>
          )}

          {showPaymentModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8 bg-card border-card-border w-96">
                <h3 className="text-2xl font-bold text-foreground mb-2">Select Payment Method</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Total Amount: <span className="text-lg font-bold text-green-500">₱{total.toLocaleString()}</span>
                </p>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => completePayment("cash")}
                    className="w-full p-4 border-2 border-input-border rounded-lg hover:border-primary hover:bg-muted transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center">
                        <span className="text-xl">💵</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Cash</p>
                        <p className="text-xs text-muted-foreground">Pay with cash</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => completePayment("qr")}
                    className="w-full p-4 border-2 border-input-border rounded-lg hover:border-primary hover:bg-muted transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">QR Code</p>
                        <p className="text-xs text-muted-foreground">Scan QR code for payment</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => completePayment("gcash")}
                    className="w-full p-4 border-2 border-input-border rounded-lg hover:border-primary hover:bg-muted transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded flex items-center justify-center">
                        <span className="text-xl">₱</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">GCash</p>
                        <p className="text-xs text-muted-foreground">Pay via GCash app</p>
                      </div>
                    </div>
                  </button>
                </div>

                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="w-full border-input-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
              </Card>
            </div>
          )}

          {showPaymentModal && selectedPayment === "cash" && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8 bg-card border-card-border w-96">
                <h3 className="text-2xl font-bold text-foreground mb-6">Cash Payment</h3>

                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">₱{total.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Amount Paid by Customer</label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => {
                        const value = e.target.value ? Number.parseFloat(e.target.value) : ""
                        setCashAmount(value)
                        if (typeof value === "number" && value >= total) {
                          setChange(value - total)
                        } else {
                          setChange(0)
                        }
                      }}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 bg-sidebar border border-sidebar-border rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent"
                      autoFocus
                    />
                  </div>

                  {change > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Change</p>
                      <p className="text-2xl font-bold text-green-500">₱{change.toFixed(2)}</p>
                    </div>
                  )}

                  {cashAmount !== "" && Number(cashAmount) < total && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      <p className="text-sm text-red-400">
                        Insufficient amount. Need ₱{(total - Number(cashAmount)).toFixed(2)} more
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setShowPaymentModal(true)
                        setSelectedPayment(null)
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={completeCashPayment}
                      disabled={cashAmount === "" || Number(cashAmount) < total}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
                    >
                      Complete Payment
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {showQRModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8 bg-card border-card-border w-96">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground">QR Code Payment</h3>
                  <button
                    onClick={() => {
                      setShowQRModal(false)
                      setShowPaymentModal(true)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Amount: <span className="text-lg font-bold text-green-500">₱{total.toLocaleString()}</span>
                </p>

                {!qrConfirmed ? (
                  <div className="space-y-6">
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        {paymentTemplates.qrCode ? (
                          <img
                            src={paymentTemplates.qrCode || "/placeholder.svg"}
                            alt="Payment QR Code"
                            className="w-48 h-48 object-contain"
                          />
                        ) : (
                          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded text-center text-sm text-muted-foreground">
                            <div>
                              <p>No QR Code</p>
                              <p className="text-xs mt-2">Upload in Billing Settings</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Show this QR code to customer</p>
                      <p className="text-xs text-muted-foreground mt-2">Customer will scan with their phone</p>
                    </div>

                    <Button onClick={confirmQRPayment} className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Confirm Payment Received
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-8">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-500 mb-2">PAID</p>
                      <p className="text-sm text-muted-foreground">Payment confirmed successfully!</p>
                      <p className="text-lg font-semibold text-foreground mt-2">₱{total.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {showGCashModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8 bg-card border-card-border w-96">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground">GCash Payment</h3>
                  <button
                    onClick={() => {
                      setShowGCashModal(false)
                      setShowPaymentModal(true)
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <p className="text-sm text-muted-foreground mb-6">
                  Amount: <span className="text-lg font-bold text-green-500">₱{total.toLocaleString()}</span>
                </p>

                {!gcashConfirmed ? (
                  <div className="space-y-6">
                    {paymentTemplates.qrCode ? (
                      <div className="bg-white/5 rounded-lg p-8 flex flex-col items-center border border-white/10">
                        <p className="text-sm text-muted-foreground mb-4">Scan with GCash App</p>
                        <img
                          src={paymentTemplates.qrCode || "/placeholder.svg"}
                          alt="GCash QR"
                          className="w-48 h-48 object-contain"
                        />
                        <p className="text-xs text-muted-foreground mt-4 text-center">
                          {paymentTemplates.gcashName && <span>{paymentTemplates.gcashName} • </span>}
                          {paymentTemplates.gcashAccount}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded-lg p-8 flex flex-col items-center border border-white/10">
                        <p className="text-sm text-muted-foreground">No GCash Template</p>
                        <p className="text-xs text-muted-foreground mt-2">Configure in Billing Settings</p>
                      </div>
                    )}

                    <Button onClick={confirmGCashPayment} className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Confirm Payment Received
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-8">
                    <div className="flex justify-center">
                      <CheckCircle className="w-16 h-16 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-500 mb-2">PAID</p>
                      <p className="text-sm text-muted-foreground">Payment confirmed successfully!</p>
                      <p className="text-lg font-semibold text-foreground mt-2">₱{total.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
