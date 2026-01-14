# Visitors Page - Data Fetching Guide

This guide explains how data flows from your Django API to the React chart.

---

## Quick Overview

```
Page Loads → useEffect → fetchData() → API Call → setChartData → Chart Renders
```

---

## Step 1: Define the Data Shape

First, we tell TypeScript what our data looks like:

```typescript
interface WeeklySummary {
  day: string;    // "Mon", "Tue", "Wed", etc.
  count: number;  // 45, 52, 63, etc.
}
```

**Why?** TypeScript catches errors before you run the code. If you accidentally use `data.date` instead of `data.day`, TypeScript warns you.

---

## Step 2: Create Fallback Data

```typescript
const fallbackData: WeeklySummary[] = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 52 },
  // ... more days
];
```

**Why?**
- Chart always shows something (good UX)
- You can develop frontend even if backend is offline

---

## Step 3: Create State Variables (useState)

```typescript
const [chartData, setChartData] = useState<WeeklySummary[]>([]);
const [loading, setLoading] = useState(false);
```

### What is useState?

`useState` creates a variable that can **change over time**. When it changes, React **re-renders** the page.

### Syntax Breakdown

```typescript
const [value, setValue] = useState(initialValue);
//     ↑        ↑                    ↑
//     |        |                    └── Starting value
//     |        └── Function to UPDATE the value
//     └── Current value (read this)
```

### Our State Variables

| Variable | Type | Initial Value | Purpose |
|----------|------|---------------|---------|
| `chartData` | `WeeklySummary[]` | `[]` (empty) | Stores API data |
| `loading` | `boolean` | `false` | Shows loading spinner |

---

## Step 4: Choose Which Data to Display

```typescript
const displayData = chartData.length > 0 ? chartData : fallbackData;
```

### What is this? (Ternary Operator)

It's a short way to write if/else:

```typescript
condition ? valueIfTrue : valueIfFalse
```

### Translation

```
IF chartData has items (API worked)
    → use chartData
ELSE (API failed or hasn't loaded)
    → use fallbackData
```

---

## Step 5: Run Code When Page Loads (useEffect)

```typescript
useEffect(() => {
  fetchData();
}, []);
```

### What is useEffect?

It runs code **after** the component appears on screen. Perfect for:
- Fetching data from API
- Setting up timers
- Changing document title

### The Dependency Array `[]`

| Array | Behavior |
|-------|----------|
| `[]` (empty) | Run **ONCE** when page loads |
| `[someValue]` | Run when `someValue` changes |
| no array | Run on **EVERY** render (bad!) |

### Think of it like:

> "Hey React, when this page first appears, go fetch data from the server"

---

## Step 6: The Fetch Function (The Main Event!)

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    
    const response = await fetch('http://127.0.0.1:8000/api/login-records/weekly-summary/');
    
    if (!response.ok) {
      throw new Error('Network response Failed');
    }
    
    const data: WeeklySummary[] = await response.json();
    setChartData(data);
    
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
  } finally {
    setLoading(false);
  }
};
```

### Let's Break It Down:

---

### 6a. `async` Keyword

```typescript
const fetchData = async () => { ... }
```

Makes the function **asynchronous** - it can wait for things (like servers responding).

---

### 6b. `setLoading(true)`

```typescript
setLoading(true);
```

Tells the UI "we're fetching, please wait". You can show a spinner:

```tsx
{loading && <p>Loading...</p>}
```

---

### 6c. `fetch()` - Make the HTTP Request

```typescript
const response = await fetch('http://127.0.0.1:8000/api/login-records/weekly-summary/');
```

**What happens:**

1. Browser sends GET request to URL
2. Django receives it, runs the view
3. Django sends back JSON:
   ```json
   [{"day": "Mon", "count": 45}, {"day": "Tue", "count": 52}]
   ```
4. `fetch()` returns a Response object

**`await`** = Pause here until server responds

---

### 6d. Check if Response is OK

```typescript
if (!response.ok) {
  throw new Error('Network response Failed');
}
```

| Status Code | response.ok |
|-------------|-------------|
| 200-299 | `true` ✅ |
| 400, 404, 500, etc. | `false` ❌ |

If not OK, we **throw an error** to jump to the `catch` block.

---

### 6e. Parse the JSON

```typescript
const data: WeeklySummary[] = await response.json();
```

Converts JSON text into JavaScript objects:

```
'{"day":"Mon","count":45}'  →  { day: "Mon", count: 45 }
```

---

### 6f. Save Data to State

```typescript
setChartData(data);
```

This:
1. Updates `chartData` from `[]` to the API data
2. Triggers React to re-render
3. `displayData` now returns `chartData` instead of `fallbackData`
4. Chart updates with real data!

---

### 6g. Catch Block - Handle Errors

```typescript
catch (error) {
  console.error('Error fetching weekly summary:', error);
}
```

Runs if **anything** fails:
- Server is down
- No internet connection
- Invalid JSON response
- Our manual `throw new Error()`

We log it but don't crash. Chart shows fallback data instead.

---

### 6h. Finally Block - Always Runs

```typescript
finally {
  setLoading(false);
}
```

**Always** runs whether success or failure:
- Success → stop loading, show data
- Error → stop loading, show fallback

User never gets stuck on loading spinner!

---

## Visual Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      PAGE LOADS                              │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  useEffect(() => { fetchData() }, [])                        │
│  "Run fetchData ONCE when component mounts"                  │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  setLoading(true)                                            │
│  "Show loading spinner"                                      │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  await fetch(API_URL)                                        │
│  "Send GET request to Django, wait for response"             │
└──────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
    ┌──────────────┐                ┌──────────────┐
    │   SUCCESS    │                │    ERROR     │
    │  (200-299)   │                │  (400,500)   │
    └──────────────┘                └──────────────┘
            │                               │
            ▼                               ▼
    response.json()                 console.error()
            │                               │
            ▼                               │
    setChartData(data)                      │
            │                               │
            └───────────────┬───────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  finally { setLoading(false) }                               │
│  "Hide loading spinner (always runs)"                        │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  displayData = chartData.length > 0 ? chartData : fallback   │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│  <BarChart data={displayData} />                             │
│  "Chart renders with the data!"                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Step 7: Display in Chart

```tsx
<BarChart data={displayData}>
  <XAxis dataKey="day" />     // X-axis shows: Mon, Tue, Wed...
  <Bar dataKey="count" />     // Bar heights: 45, 52, 49...
</BarChart>
```

**How data maps to chart:**

```
{ day: "Mon", count: 45 }  →  Bar at "Mon" with height 45
{ day: "Tue", count: 52 }  →  Bar at "Tue" with height 52
{ day: "Wed", count: 49 }  →  Bar at "Wed" with height 49
```

---

## Common Mistakes to Avoid

| Mistake | Problem | Fix |
|---------|---------|-----|
| Forget `async` | Can't use `await` | Add `async` before `() =>` |
| Forget `await` | Get Promise instead of data | Add `await` before `fetch()` |
| Wrong `dataKey` | Chart shows nothing | Match interface property names |
| No error handling | App crashes on failure | Use try/catch |
| Forget `[]` in useEffect | Infinite loop! | Add empty `[]` |

---

## Quick Reference

```typescript
// 1. State
const [data, setData] = useState([]);

// 2. Fetch on load
useEffect(() => {
  fetchData();
}, []);

// 3. Fetch function
const fetchData = async () => {
  try {
    const response = await fetch(URL);
    const json = await response.json();
    setData(json);
  } catch (error) {
    console.error(error);
  }
};
```

---

## Next Steps

Once you understand this pattern, you can:
- Add POST requests to send data
- Add loading spinners
- Add error messages in UI
- Fetch data on button click
- Add pagination
