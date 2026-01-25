# Extending Pagination to Transactions & CartItems

> A step-by-step guide based on your existing Products pagination code.

---

## What You Already Have (Products)

You've successfully implemented pagination for products:

```typescript
// State variables
const [products, setProducts] = useState<Product[]>([])
const [nextPage, setNextPage] = useState<string | null>(null);
const [prevPage, setPrevPage] = useState<string | null>(null);
const [totalPages, setTotalPage] = useState<number>(1)
const [currentPage, setCurrentPage] = useState<number>(1)

// Fetch function
const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/product/') => {
  const response = await fetch(url);
  const data: PaginatedResponse<Product> = await response.json();
  setProducts(data.results);
  setNextPage(data.next);
  setPrevPage(data.previous);
  setTotalPage(data.total_page);
  setCurrentPage(data.current_page);
  return data.results;
}
```

---

## Step 1: Add Types for Transaction & CartItem

Add these types alongside your existing `Product` type:

```typescript
type Transaction = {
  id: number
  date: string
  items: number          // ForeignKey ID to Product
  total: number
  price: number
  paymentMethod: string
  changes: number
  created_at: string
  updated_at: string
}

type CartItemAPI = {
  id: number
  name: number           // ForeignKey ID to Transaction
  items: number          // ForeignKey ID to Product
  quantity: number
  price: number
  created_at: string
  updated_at: string
}
```

> **Note**: The `PaginatedResponse<T>` interface you already have works for all types!

---

## Step 2: Add State Variables

Add separate pagination state for each entity:

```typescript
// ═══════════════════════════════════════════
// TRANSACTIONS PAGINATION STATE
// ═══════════════════════════════════════════
const [apiTransactions, setApiTransactions] = useState<Transaction[]>([])
const [transNextPage, setTransNextPage] = useState<string | null>(null);
const [transPrevPage, setTransPrevPage] = useState<string | null>(null);
const [transTotalPages, setTransTotalPage] = useState<number>(1)
const [transCurrentPage, setTransCurrentPage] = useState<number>(1)

// ═══════════════════════════════════════════
// CART ITEMS PAGINATION STATE
// ═══════════════════════════════════════════
const [apiCartItems, setApiCartItems] = useState<CartItemAPI[]>([])
const [cartNextPage, setCartNextPage] = useState<string | null>(null);
const [cartPrevPage, setCartPrevPage] = useState<string | null>(null);
const [cartTotalPages, setCartTotalPage] = useState<number>(1)
const [cartCurrentPage, setCartCurrentPage] = useState<number>(1)
```

---

## Step 3: Create Fetch Functions

### Transactions Fetch
```typescript
const fetchTransactions = async (url: string = 'http://127.0.0.1:8000/api/transaction/') => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    
    const data: PaginatedResponse<Transaction> = await response.json();
    
    setApiTransactions(data.results);
    setTransNextPage(data.next);
    setTransPrevPage(data.previous);
    setTransTotalPage(data.total_page);
    setTransCurrentPage(data.current_page);
    
    return data.results;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}
```

### CartItems Fetch
```typescript
const fetchCartItems = async (url: string = 'http://127.0.0.1:8000/api/cart-item/') => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch cart items');
    
    const data: PaginatedResponse<CartItemAPI> = await response.json();
    
    setApiCartItems(data.results);
    setCartNextPage(data.next);
    setCartPrevPage(data.previous);
    setCartTotalPage(data.total_page);
    setCartCurrentPage(data.current_page);
    
    return data.results;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}
```

---

## Step 4: Load Data in useEffect

```typescript
useEffect(() => {
  const loadAllData = async () => {
    await fetchProducts();
    await fetchTransactions();
    await fetchCartItems();
  };
  loadAllData();
}, [])
```

---

## Step 5: UI Pagination Controls

### Reusable Pagination Component Pattern

Instead of repeating the same buttons, create a pattern:

```tsx
// Reusable pagination controls
const PaginationControls = ({ 
  prevPage, 
  nextPage, 
  currentPage, 
  totalPages, 
  onFetch 
}: {
  prevPage: string | null;
  nextPage: string | null;
  currentPage: number;
  totalPages: number;
  onFetch: (url: string) => void;
}) => (
  <div className="flex justify-between items-center mt-4">
    <button
      onClick={() => prevPage && onFetch(prevPage)}
      disabled={!prevPage}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
    >
      Previous
    </button>
    
    <span className="text-sm text-muted-foreground">
      Page {currentPage} of {totalPages}
    </span>
    
    <button
      onClick={() => nextPage && onFetch(nextPage)}
      disabled={!nextPage}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
    >
      Next
    </button>
  </div>
);
```

### Usage for Each Entity

```tsx
{/* Products Pagination */}
<PaginationControls
  prevPage={prevPage}
  nextPage={nextPage}
  currentPage={currentPage}
  totalPages={totalPages}
  onFetch={fetchProducts}
/>

{/* Transactions Pagination */}
<PaginationControls
  prevPage={transPrevPage}
  nextPage={transNextPage}
  currentPage={transCurrentPage}
  totalPages={transTotalPages}
  onFetch={fetchTransactions}
/>

{/* Cart Items Pagination */}
<PaginationControls
  prevPage={cartPrevPage}
  nextPage={cartNextPage}
  currentPage={cartCurrentPage}
  totalPages={cartTotalPages}
  onFetch={fetchCartItems}
/>
```

---

## Step 6: Example - Transaction History Table with Pagination

Here's how to add pagination to your existing transaction history:

```tsx
{showHistory && (
  <Card className="bg-card border-card-border overflow-hidden">
    <table className="w-full">
      <thead>
        <tr className="border-b border-card-border bg-background/50">
          <th className="px-6 py-3 text-left">Date</th>
          <th className="px-6 py-3 text-left">Product</th>
          <th className="px-6 py-3 text-left">Total</th>
          <th className="px-6 py-3 text-left">Payment</th>
        </tr>
      </thead>
      <tbody>
        {apiTransactions.map((transaction) => (
          <tr key={transaction.id} className="border-b border-card-border">
            <td className="px-6 py-4">{transaction.created_at}</td>
            <td className="px-6 py-4">Item #{transaction.items}</td>
            <td className="px-6 py-4">₱{transaction.price}</td>
            <td className="px-6 py-4">{transaction.paymentMethod}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    {/* Pagination Controls */}
    <div className="flex justify-between items-center p-4 border-t">
      <button
        onClick={() => transPrevPage && fetchTransactions(transPrevPage)}
        disabled={!transPrevPage}
        className="px-4 py-2 bg-primary rounded-md disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {transCurrentPage} of {transTotalPages}</span>
      <button
        onClick={() => transNextPage && fetchTransactions(transNextPage)}
        disabled={!transNextPage}
        className="px-4 py-2 bg-primary rounded-md disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </Card>
)}
```

---

## API Endpoints Reference

Based on your `urls.py`:

| Entity | Endpoint |
|--------|----------|
| Products | `http://127.0.0.1:8000/api/product/` |
| Transactions | `http://127.0.0.1:8000/api/transaction/` |
| Cart Items | `http://127.0.0.1:8000/api/cart-item/` |

---

## Complete Code Summary

```typescript
// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_page: number;
  results: T[];
}

// ═══════════════════════════════════════════════════════════════
// STATE (add these to your component)
// ═══════════════════════════════════════════════════════════════

// Products (you already have these)
const [products, setProducts] = useState<Product[]>([])
const [nextPage, setNextPage] = useState<string | null>(null);
const [prevPage, setPrevPage] = useState<string | null>(null);
const [totalPages, setTotalPage] = useState<number>(1)
const [currentPage, setCurrentPage] = useState<number>(1)

// Transactions (add these)
const [apiTransactions, setApiTransactions] = useState<Transaction[]>([])
const [transNextPage, setTransNextPage] = useState<string | null>(null);
const [transPrevPage, setTransPrevPage] = useState<string | null>(null);
const [transTotalPages, setTransTotalPage] = useState<number>(1)
const [transCurrentPage, setTransCurrentPage] = useState<number>(1)

// ═══════════════════════════════════════════════════════════════
// FETCH FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const fetchProducts = async (url = 'http://127.0.0.1:8000/api/product/') => { ... }
const fetchTransactions = async (url = 'http://127.0.0.1:8000/api/transaction/') => { ... }
const fetchCartItems = async (url = 'http://127.0.0.1:8000/api/cart-item/') => { ... }
```

---

## Key Pattern to Remember

For **every paginated entity**, you need:

1. **State array** for the items: `useState<Type[]>([])`
2. **4 pagination states**: `nextPage`, `prevPage`, `currentPage`, `totalPages`
3. **Fetch function** that updates all 5 states
4. **UI controls** for Previous/Next buttons

---

*Created: January 25, 2026*
