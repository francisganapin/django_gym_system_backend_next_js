# Django REST Framework Pagination with Next.js

> A guide to properly handling paginated API responses from Django in your React/Next.js frontend.

---

## The Problem

When fetching data from a Django REST Framework API that uses pagination, you may encounter this error:

```
TypeError: products.map is not a function
```

This happens because the API returns an **object** (with pagination metadata), not a direct **array** of items.

---

## Understanding the Response Structure

### ❌ What You Might Expect
```json
[
  { "id": 1, "name": "Product A", "price": 50.00 },
  { "id": 2, "name": "Product B", "price": 75.00 }
]
```

### ✅ What Django REST Framework Actually Returns
```json
{
  "count": 7,
  "next": "http://127.0.0.1:8000/api/product/?page=2",
  "previous": null,
  "current_page": 1,
  "total_page": 1,
  "results": [
    { "id": 1, "name": "Product A", "price": 50.00 },
    { "id": 2, "name": "Product B", "price": 75.00 }
  ]
}
```

| Field | Description |
|-------|-------------|
| `count` | Total number of items across all pages |
| `next` | URL for the next page (or `null` if last page) |
| `previous` | URL for the previous page (or `null` if first page) |
| `current_page` | The current page number |
| `total_page` | Total number of pages |
| `results` | **The actual array of items** |

---

## The Solution

### Before (Incorrect)
```typescript
const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/product/') => {
  const response = await fetch(url);
  const data: Product[] = await response.json();  // ❌ Wrong type!
  return data;  // ❌ Returns the whole object, not the array
}
```

### After (Correct)
```typescript
const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/product/') => {
  const response = await fetch(url);
  const data = await response.json();
  return data.results as Product[];  // ✅ Extract the 'results' array
}
```

---

## TypeScript Types

For better type safety, define an interface for the paginated response:

```typescript
// Define the pagination response structure
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  current_page: number;
  total_page: number;
  results: T[];
}

// Usage
const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/product/') => {
  const response = await fetch(url);
  const data: PaginatedResponse<Product> = await response.json();
  return data.results;
}
```

---

## Implementing Pagination in the Frontend

Here's how to use the pagination metadata for navigation:

```typescript
const [products, setProducts] = useState<Product[]>([]);
const [nextPage, setNextPage] = useState<string | null>(null);
const [prevPage, setPrevPage] = useState<string | null>(null);
const [totalPages, setTotalPages] = useState(1);
const [currentPage, setCurrentPage] = useState(1);

const fetchProducts = async (url: string = 'http://127.0.0.1:8000/api/product/') => {
  const response = await fetch(url);
  const data = await response.json();
  
  setProducts(data.results);
  setNextPage(data.next);
  setPrevPage(data.previous);
  setTotalPages(data.total_page);
  setCurrentPage(data.current_page);
};

// Navigation buttons
<button 
  onClick={() => prevPage && fetchProducts(prevPage)}
  disabled={!prevPage}
>
  Previous
</button>

<span>Page {currentPage} of {totalPages}</span>

<button 
  onClick={() => nextPage && fetchProducts(nextPage)}
  disabled={!nextPage}
>
  Next
</button>
```

---

## Django Backend Setup Reference

### Pagination Class (`views.py`)
```python
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class SevenPerPagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current_page': self.page.number,
            'total_page': self.page.paginator.num_pages,
            'results': data
        })
```

### ViewSet with Pagination
```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = SevenPerPagePagination
```

---

## Quick Reference

| Task | Code |
|------|------|
| Get items array | `response.results` |
| Check if more pages exist | `response.next !== null` |
| Get total items | `response.count` |
| Get current page | `response.current_page` |
| Navigate to next page | `fetch(response.next)` |

---

## Common Mistakes to Avoid

1. **Treating the response as an array directly**
   ```typescript
   // ❌ Don't do this
   const products = await response.json();
   products.map(...)  // Error: map is not a function
   ```

2. **Forgetting the trailing slash in Django URLs**
   ```typescript
   // ❌ May cause redirect issues
   fetch('http://127.0.0.1:8000/api/product')
   
   // ✅ Include trailing slash
   fetch('http://127.0.0.1:8000/api/product/')
   ```

3. **Not handling empty results**
   ```typescript
   // ✅ Safe handling
   const products = data.results || [];
   ```

---

*Created: January 25, 2026*
