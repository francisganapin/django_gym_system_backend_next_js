# Await Expression Error Fix Documentation

**Date:** January 25, 2026  
**File:** `app/point-of-sale/page.tsx`  
**Error:** `'await' expressions are only allowed within async functions and at the top levels of modules`

---

## The Problem

### Error Message
```
'await' expressions are only allowed within async functions and at the top levels of modules.
```

### What Happened
The error occurred because `await` was being used inside `setTimeout` callbacks that were **not** marked as `async` functions.

---

## Understanding Async/Await in JavaScript

### Rule
> The `await` keyword can **only** be used inside:
> 1. Functions declared with the `async` keyword
> 2. Top-level code in ES modules

### Why This Matters
When you use `await`, JavaScript knows to pause execution of that function until the Promise resolves. But JavaScript needs to know ahead of time that this function will have asynchronous behavior — that's what the `async` keyword signals.

---

## The Code Before Fix

### `confirmQRPayment` function (Line ~213)
```javascript
setTimeout(() => {  // ❌ Regular arrow function - NOT async
  for (const item of cart) {
    await createTransaction({  // ❌ ERROR: await not allowed here
      transaction_id: transactions.length + 1,
      items: item.id,
      total: item.qty,
      price: item.price * item.qty,
      paymentMethod: "QR",
      cashAmount: Number(cashAmount),
      changes: changeAmount,
    })
  }
  // ... rest of code
}, 1500)
```

### `confirmGCashPayment` function (Line ~251)
```javascript
setTimeout(() => {  // ❌ Regular arrow function - NOT async
  for (const item of cart) {
    await createTransaction({  // ❌ ERROR: await not allowed here
      transaction_id: transactions.length + 1,
      items: item.id,
      total: item.qty,
      price: item.price * item.qty,
      paymentMethod: "GCash",
      cashAmount: Number(cashAmount),
      changes: changeAmount,
    })
  }
  // ... rest of code
}, 1500)
```

---

## The Solution

### What We Changed
Added the `async` keyword to the `setTimeout` callback functions:

```diff
- setTimeout(() => {
+ setTimeout(async () => {
```

### Code After Fix

```javascript
setTimeout(async () => {  // ✅ Now it's an async arrow function
  for (const item of cart) {
    await createTransaction({  // ✅ await works correctly now
      transaction_id: transactions.length + 1,
      items: item.id,
      total: item.qty,
      price: item.price * item.qty,
      paymentMethod: "QR",  // or "GCash" for the other function
      cashAmount: Number(cashAmount),
      changes: changeAmount,
    })
  }
  // ... rest of code
}, 1500)
```

---

## Quick Reference: Function Types

| Syntax | Type | Can use `await`? |
|--------|------|------------------|
| `function foo() {}` | Regular function | ❌ No |
| `async function foo() {}` | Async function | ✅ Yes |
| `() => {}` | Arrow function | ❌ No |
| `async () => {}` | Async arrow function | ✅ Yes |

---

## Additional Changes Made by User

After the fix, the payment method labels were also corrected:

| Function | Before | After |
|----------|--------|-------|
| `confirmQRPayment` | `"Cash"` | `"QR"` |
| `confirmGCashPayment` | `"Cash"` | `"GCash"` |

---

## Key Takeaways

1. **Always mark functions as `async`** if you need to use `await` inside them
2. **This applies to all function types**: regular functions, arrow functions, methods, and callbacks
3. **setTimeout callbacks are not automatically async** — you must explicitly add the `async` keyword
4. **The `createTransaction` function returns a Promise** (since it uses `fetch`), so it must be awaited

---

## Related Files

- **Frontend:** `app/point-of-sale/page.tsx` — Point of Sale React component
- **Backend API:** `http://127.0.0.1:8000/api/transaction/` — Django transaction endpoint
