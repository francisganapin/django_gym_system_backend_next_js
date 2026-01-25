# Understanding HTTP 400 Errors in Django REST API

> Why your POST request is being rejected and how to fix it.

---

## What is a 400 Error?

```
"POST /api/transaction/ HTTP/1.1" 400 99
```

| Part | Meaning |
|------|---------|
| `POST` | Creating new data |
| `/api/transaction/` | Your endpoint |
| `400` | **Bad Request** - Data validation failed |
| `99` | Response body size (bytes) |

**Translation:** Django received your request but **rejected the data** because it doesn't match what the model expects.

---

## Your Current Problem

### What You're Sending (Frontend)
```typescript
await createTransaction({
  id: 0,
  date: new Date().toISOString(),
  items: [item],                    // ❌ Array of objects
  total: item.price * item.qty,     // ❌ This is price, not quantity
  paymentMethod: "Cash",
  cashAmount: Number(cashAmount),
  change: changeAmount,             // ❌ Wrong field name
})
```

### What Django Expects (Based on Your Model)
```python
class Transaction(models.Model):
    date = models.DateTimeField(auto_now_add=True)      # Auto-generated, don't send
    items = models.ForeignKey(Product, ...)             # Product ID (integer)
    total = models.IntegerField()                       # Quantity (integer)
    price = models.DecimalField(...)                    # Total price
    paymentMethod = models.CharField(...)               # "Cash", "QR Code", etc.
    cashAmount = models.IntegerField()                  # Amount paid
    changes = models.FloatField(...)                    # Change (note: "changes")
```

---

## The Comparison Table

| Field | You're Sending | Django Expects | Fix |
|-------|----------------|----------------|-----|
| `id` | `0` | ❌ Don't send | Remove it |
| `date` | `"2026-01-25T..."` | ❌ Auto-generated | Remove it |
| `items` | `[{id, name, ...}]` | `13` (Product ID) | Use `item.id` |
| `total` | `100.00` (price) | `2` (quantity) | Use `item.qty` |
| `price` | ❌ Missing | `100.00` | Add it |
| `paymentMethod` | `"Cash"` | ✅ Correct | Keep it |
| `cashAmount` | ✅ Correct | ✅ Correct | Keep it |
| `change` | `50.00` | ❌ Field not recognized | → `changes` |

---

## The Fix

### Before (Broken)
```typescript
await createTransaction({
  id: 0,                            // ❌ Remove
  date: new Date().toISOString(),   // ❌ Remove
  items: [item],                    // ❌ Wrong type
  total: item.price * item.qty,     // ❌ Wrong value
  paymentMethod: "Cash",
  cashAmount: Number(cashAmount),
  change: changeAmount,             // ❌ Wrong name
})
```

### After (Fixed)
```typescript
await createTransaction({
  items: item.id,                   // ✅ Product ID (number)
  total: item.qty,                  // ✅ Quantity (integer)
  price: item.price * item.qty,     // ✅ Total price
  paymentMethod: "Cash",
  cashAmount: Number(cashAmount),   // ✅ Amount paid
  changes: changeAmount,            // ✅ "changes" not "change"
})
```

---

## Visual Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  CART ITEM IN FRONTEND                                          │
│  {                                                              │
│    id: 13,                                                      │
│    name: "Standard Monthly Membership",                         │
│    price: 50.00,                                                │
│    qty: 2                                                       │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  TRANSFORM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DATA TO SEND TO API                                            │
│  {                                                              │
│    items: 13,              ←── item.id (just the number!)      │
│    total: 2,               ←── item.qty (quantity)             │
│    price: 100.00,          ←── item.price * item.qty           │
│    paymentMethod: "Cash",                                       │
│    cashAmount: 150,        ←── what customer paid              │
│    changes: 50.00          ←── change to give back             │
│  }                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  POST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DJANGO DATABASE                                                │
│  ✅ 201 Created                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## How to Debug 400 Errors

### Step 1: Add Error Logging
```typescript
const createTransaction = async (data: any) => {
  console.log('Sending to API:', data);  // See what you're sending
  
  const response = await fetch('http://127.0.0.1:8000/api/transaction/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('API rejected:', errorData);  // See why it failed
    throw new Error(JSON.stringify(errorData));
  }
  
  return await response.json();
};
```

### Step 2: Check Browser Console
Open DevTools (F12) → Console tab → Look for:
- `Sending to API: {...}` - What you sent
- `API rejected: {...}` - Why Django rejected it

### Step 3: Common Django Error Messages

| Error Message | Meaning | Fix |
|--------------|---------|-----|
| `"items": ["This field is required."]` | Missing `items` field | Add `items: item.id` |
| `"items": ["Incorrect type..."]` | Wrong type | Should be number, not array |
| `"total": ["A valid integer is required."]` | Sent decimal | Use integer: `item.qty` |
| `"changes": ["This field is required."]` | Sent `change` not `changes` | Rename to `changes` |

---

## Complete Working Code

```typescript
const completeCashPayment = async () => {
  if (cashAmount === "" || Number(cashAmount) < total) {
    alert("Insufficient payment amount");
    return;
  }

  const changeAmount = Number(cashAmount) - total;
  setChange(changeAmount);

  try {
    for (const item of cart) {
      await createTransaction({
        items: item.id,                    // Product ID
        total: item.qty,                   // Quantity (integer)
        price: item.price * item.qty,      // Total price
        paymentMethod: "Cash",
        cashAmount: Math.floor(Number(cashAmount)),  // Integer
        changes: changeAmount,             // Change amount
      });
    }

    // ... rest of your code
    
  } catch (error) {
    console.error('Failed:', error);
    alert('Failed to save transaction');
  }
};
```

---

## Remember: Run Migrations!

Since you added `cashAmount` to your Django model, you need to run:

```bash
cd gym_backend
python manage.py makemigrations
python manage.py migrate
```

---

*Created: January 25, 2026*
