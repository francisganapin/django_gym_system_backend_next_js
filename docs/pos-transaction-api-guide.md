# POS Transaction API Integration Guide

> Complete guide for connecting your Next.js POS frontend to Django REST API.

---

## Understanding the Data Mismatch Problem

Your frontend `Transaction` type and Django `Transaction` model have **different structures**:

### Frontend Type (what you have in React)
```typescript
type Transaction = {
  id: number
  date: string
  items: CartItem[]        // Array of cart items
  total: number
  paymentMethod: string
  cashAmount?: number
  change?: number
}
```

### Django Model (what the database expects)
```python
class Transaction(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    items = models.ForeignKey(Product, on_delete=models.CASCADE)  # Just a Product ID!
    total = models.IntegerField()
    price = models.DecimalField(...)
    paymentMethod = models.CharField(...)
    changes = models.FloatField(...)  # Note: "changes" not "change"
```

### The Key Differences

| Field | Frontend | Django API |
|-------|----------|------------|
| `items` | `CartItem[]` (array) | `number` (Product ID) |
| `total` | Total price | Quantity |
| `price` | Not used | Total price |
| `change` | Change amount | ❌ Not recognized |
| `changes` | ❌ Not used | Change amount |

---

## Solution: Create a Separate API Type

### Step 1: Add API Type

Add this type alongside your existing `Transaction` type:

```typescript
// Type for sending to Django API
type TransactionAPI = {
  items: number           // Product ID (ForeignKey)
  total: number           // Quantity
  price: number           // Total price
  paymentMethod: string   // "Cash", "QR Code", "GCash"
  changes: number         // Change amount
}
```

### Step 2: Update createTransaction Function

```typescript
const createTransaction = async (data: TransactionAPI) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/transaction/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Failed to create transaction');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Step 3: Call with Correct Data

```typescript
const completeCashPayment = async () => {
  if (cashAmount === "" || Number(cashAmount) < total) {
    alert("Insufficient payment amount");
    return;
  }

  const changeAmount = Number(cashAmount) - total;
  setChange(changeAmount);

  try {
    // Save each cart item as a separate transaction
    for (const item of cart) {
      await createTransaction({
        items: item.id,                    // ✅ Product ID (number)
        total: item.qty,                   // ✅ Quantity
        price: item.price * item.qty,      // ✅ Total price for this item
        paymentMethod: "Cash",
        changes: changeAmount,             // ✅ "changes" not "change"
      });
    }

    // Update local state for UI
    const newTransaction = {
      id: transactions.length + 1,
      date: new Date().toLocaleString(),
      items: [...cart],
      total: total,
      paymentMethod: "Cash",
      cashAmount: Number(cashAmount),
      change: changeAmount,
    };

    setTransactions([newTransaction, ...transactions]);
    setCart([]);
    setShowPaymentModal(false);
    setCashAmount("");
    setChange(0);
    alert(`Payment received! Change: ₱${changeAmount.toFixed(2)}`);
    
  } catch (error) {
    alert('Failed to save transaction to database');
  }
};
```

---

## Visual Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         CART STATE                              │
│  [{ id: 13, name: "Membership", price: 50, qty: 2 }]           │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    TRANSFORM FOR API                            │
│  {                                                              │
│    items: 13,              ◄── item.id (Product ID)            │
│    total: 2,               ◄── item.qty (Quantity)             │
│    price: 100,             ◄── item.price * item.qty           │
│    paymentMethod: "Cash",                                       │
│    changes: 50             ◄── changeAmount                     │
│  }                                                              │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              POST to Django API                                 │
│  fetch('http://127.0.0.1:8000/api/transaction/', {             │
│    method: 'POST',                                              │
│    body: JSON.stringify(data)                                   │
│  })                                                             │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│              DJANGO DATABASE                                    │
│  Transaction Table:                                             │
│  | id | items_id | total | price  | paymentMethod | changes |  │
│  | 1  | 13       | 2     | 100.00 | Cash          | 50.00   |  │
└────────────────────────────────────────────────────────────────┘
```

---

## Why Two Different Types?

| Type | Purpose |
|------|---------|
| `Transaction` | For **displaying** in the frontend UI (history table, cart summary) |
| `TransactionAPI` | For **sending** to Django REST API (matches database structure) |

The frontend needs human-readable data (item names, formatted dates), but the database only stores IDs and numbers.

---

## Common Errors & Fixes

### Error: `"items" must be a valid integer`
**Cause:** Sending `items: [cartItem]` instead of `items: productId`  
**Fix:** Use `items: item.id` (just the number)

### Error: `"changes" field is required`
**Cause:** Sending `change: value` instead of `changes: value`  
**Fix:** Django model uses `changes` (plural)

### Error: `CORS policy blocked`
**Cause:** Django not configured for cross-origin requests  
**Fix:** Ensure `django-cors-headers` is installed and configured in Django settings

### Error: `Method "POST" not allowed`
**Cause:** Serializer is broken  
**Fix:** Check `serializers.py` - must have `class Meta:` (not `Mega`), `model` (not `models`), `fields` (not `field`)

---

## Quick Reference

```typescript
// ✅ CORRECT - What to send to Django API
await createTransaction({
  items: 13,                    // Product ID
  total: 2,                     // Quantity
  price: 100.00,                // Total price
  paymentMethod: "Cash",
  changes: 50.00                // Change amount
});

// ❌ WRONG - Frontend Transaction type
await createTransaction({
  id: 1,
  date: "1/25/2026",
  items: [{ id: 13, name: "...", ... }],  // Wrong! Should be just ID
  total: 100,
  paymentMethod: "Cash",
  change: 50                              // Wrong! Should be "changes"
});
```

---

*Created: January 25, 2026*
