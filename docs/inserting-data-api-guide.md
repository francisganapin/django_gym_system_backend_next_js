# Inserting Data via Django REST API

> How to POST (create/insert) Transactions and CartItems from your Next.js frontend.

---

## API Endpoints for Creating Data

| Action | Method | Endpoint |
|--------|--------|----------|
| Create Transaction | `POST` | `http://127.0.0.1:8000/api/transaction/` |
| Create CartItem | `POST` | `http://127.0.0.1:8000/api/cart-item/` |

---

## Step 1: Create Transaction Function

Add this function to your `page.tsx`:

```typescript
const createTransaction = async (transactionData: {
  items: number;           // Product ID (ForeignKey)
  total: number;
  price: number;
  paymentMethod: string;
  changes: number;
}) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/transaction/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    const newTransaction = await response.json();
    console.log('Transaction created:', newTransaction);
    return newTransaction;
    
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
```

---

## Step 2: Use in Your Checkout Flow

Modify your existing `completeCashPayment` function:

```typescript
const completeCashPayment = async () => {
  if (cashAmount === "" || Number(cashAmount) < total) {
    alert("Insufficient payment amount");
    return;
  }

  const changeAmount = Number(cashAmount) - total;
  setChange(changeAmount);

  try {
    // ═══════════════════════════════════════════════════
    // POST each cart item as a transaction to the API
    // ═══════════════════════════════════════════════════
    for (const item of cart) {
      await createTransaction({
        items: item.id,                    // Product ID
        total: item.qty,                   // Quantity
        price: item.price * item.qty,      // Total price for this item
        paymentMethod: "Cash",
        changes: changeAmount,
      });
    }

    // Clear cart and close modal after successful API calls
    setCart([]);
    setShowPaymentModal(false);
    setCashAmount("");
    setChange(0);
    alert(`Payment received! Change: ₱${changeAmount.toFixed(2)}`);

  } catch (error) {
    alert("Failed to save transaction. Please try again.");
  }
};
```

---

## Step 3: For QR/GCash Payments

Apply the same pattern to `confirmQRPayment` and `confirmGCashPayment`:

```typescript
const confirmQRPayment = async () => {
  setQRConfirmed(true);

  try {
    // Save to API
    for (const item of cart) {
      await createTransaction({
        items: item.id,
        total: item.qty,
        price: item.price * item.qty,
        paymentMethod: "QR Code",
        changes: 0,
      });
    }

    setTimeout(() => {
      setCart([]);
      setShowPaymentModal(false);
      setShowQRModal(false);
      setQRConfirmed(false);
      alert(`Payment received via QR Code! ₱${total.toLocaleString()}`);
    }, 1500);

  } catch (error) {
    alert("Failed to save transaction");
    setQRConfirmed(false);
  }
};
```

---

## Creating CartItems

```typescript
const createCartItem = async (cartItemData: {
  name: number;      // Transaction ID (ForeignKey)
  items: number;     // Product ID (ForeignKey)  
  quantity: number;
  price: number;
}) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/cart-item/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    if (!response.ok) throw new Error('Failed to create cart item');
    return await response.json();
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## Complete Flow: Transaction + CartItems

If you want to save both a transaction AND its cart items:

```typescript
const saveCompleteTransaction = async (paymentMethod: string, changeAmount: number) => {
  try {
    // 1. Create main transaction for first item (or create a summary transaction)
    const transaction = await createTransaction({
      items: cart[0].id,
      total: cart.reduce((sum, item) => sum + item.qty, 0),
      price: total,
      paymentMethod: paymentMethod,
      changes: changeAmount,
    });

    // 2. Create CartItem for each item in cart
    for (const item of cart) {
      await createCartItem({
        name: transaction.id,    // Link to the transaction we just created
        items: item.id,          // Product ID
        quantity: item.qty,
        price: item.price,
      });
    }

    return transaction;
  } catch (error) {
    console.error('Failed to save transaction:', error);
    throw error;
  }
};

// Usage in checkout:
const completeCashPayment = async () => {
  const changeAmount = Number(cashAmount) - total;
  
  await saveCompleteTransaction("Cash", changeAmount);
  
  setCart([]);
  setShowPaymentModal(false);
  alert(`Payment received! Change: ₱${changeAmount.toFixed(2)}`);
};
```

---

## Quick Reference: HTTP Methods

| Method | Action | Example |
|--------|--------|---------|
| `GET` | Fetch/Read | `fetch(url)` |
| `POST` | Create/Insert | `fetch(url, { method: 'POST', body: JSON.stringify(data) })` |
| `PUT` | Update (full) | `fetch(url/id, { method: 'PUT', body: JSON.stringify(data) })` |
| `PATCH` | Update (partial) | `fetch(url/id, { method: 'PATCH', body: JSON.stringify(data) })` |
| `DELETE` | Delete | `fetch(url/id, { method: 'DELETE' })` |

---

## Important: Fix Your Serializers First!

Your `pos_portal/serializers.py` has typos that will cause POST requests to fail:

```python
# ❌ CURRENT (with errors)
class TransactionSerializer(serializers.ModelSerializer):
    class Mega:           # Should be Meta
        models = Transaction  # Should be model
        field = '__all__'     # Should be fields

# ✅ CORRECT
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
```

---

*Created: January 25, 2026*
