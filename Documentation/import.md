# Django & Django REST Framework Imports Guide

## Problem We Solved

You had two ViewSets using the same model, causing a `basename` conflict. We separated them into:

* `LoginRecordCreateView` - for individual login records
* `MemberLoginRecordViewSet` - for aggregated statistics

Then you got a `NameError` because `ExtractWeekDay` wasn't imported.

---

## Import Breakdown

### Django Core Imports

```python
from django.shortcuts import render
```

**What it does:** Imports the `render()` function

**What it's for:** Renders HTML templates with context data

**Example:** `return render(request, 'template.html', {'data': data})`

**When to use:** When you need to return HTML pages (not needed for REST APIs)

---

```python
from django.utils import timezone
```

**What it does:** Imports Django's timezone utilities

**What it's for:** Gets the current date/time in a timezone-aware way

**Example:** `today = timezone.now()`

**When to use:** When working with dates/times (respects TIME_ZONE setting)

---

```python
from django.db.models import Count
```

**What it does:** Imports the `Count` aggregation function

**What it's for:** Counts records in database queries

**Example:** `.annotate(count=Count('id'))` - counts how many records

**When to use:** When you need to count related objects or group data

---

```python
from django.db.models.functions import TruncDate, ExtractWeekDay
```

**What it does:** Imports database functions for date manipulation

**`TruncDate`:**

* Truncates a datetime to just the date part
* Example: `2026-01-14 15:30:00` → `2026-01-14`
* Use when: You want to group by date, ignoring time

**`ExtractWeekDay`:**

* Extracts the day of the week from a date
* Returns: 1=Sunday, 2=Monday, 3=Tuesday, ..., 7=Saturday
* Example: `ExtractWeekDay('login_time')` → returns 4 for Wednesday
* Use when: You want to group/filter by day of week

---

```python
from datetime import datetime, timedelta
```

**What it does:** Imports Python's built-in date/time classes

**`datetime`:**

* Represents a specific date and time
* Example: `datetime(2026, 1, 14, 15, 30)`
* Use when: Creating or parsing specific dates

**`timedelta`:**

* Represents a duration (difference between two dates)
* Example: `timedelta(days=7)` = 7 days
* Example: `today - timedelta(days=7)` = date from 1 week ago
* Use when: Adding/subtracting time periods

---

### Django REST Framework Imports

```python
from rest_framework import viewsets, permissions
```

**What it does:** Imports DRF's viewsets and permissions modules

**`viewsets`:**

* Provides `ModelViewSet` class
* Automatically creates CRUD endpoints (Create, Read, Update, Delete)
* Example: `class MyViewSet(viewsets.ModelViewSet):`
* Use when: Building REST APIs for models

**`permissions`:**

* Controls who can access your API endpoints
* Example: `permission_classes = [permissions.IsAuthenticated]`
* Use when: You need authentication/authorization

---

```python
from rest_framework.decorators import api_view, action
```

**What it does:** Imports decorators for creating API endpoints

**`@api_view`:**

* Converts a function into a REST API endpoint
* Example: `@api_view(['GET', 'POST'])`
* Use when: Creating simple function-based views

**`@action`:**

* Adds custom endpoints to ViewSets
* Example: `@action(detail=False, methods=['get'], url_path='weekly-summary')`
* Use when: Adding custom actions beyond standard CRUD

---

```python
from rest_framework.pagination import PageNumberPagination
```

**What it does:** Imports pagination class

**What it's for:** Splits large result sets into pages

**Example:** Results shown as `?page=1`, `?page=2`, etc.

**When to use:** When you have many records and want to load them in chunks

---

```python
from rest_framework.response import Response
```

**What it does:** Imports the `Response` class

**What it's for:** Returns data from API endpoints as JSON

**Example:** `return Response({'status': 'success', 'data': data})`

**When to use:** Every time you return data from an API view

---

```python
from rest_framework.views import APIView
```

**What it does:** Imports the base class for class-based API views

**What it's for:** Creating custom API views with more control

**Example:**

```python
class MyView(APIView):
    def get(self, request):
        return Response({'message': 'Hello'})
```

**When to use:** When you need more control than ViewSets provide

---

## Your Specific Use Case

In your `weekly_summary` action, you use:

1. **`timezone.now()`** - Get current date/time
2. **`timedelta(days=...)`** - Calculate date ranges
3. **`ExtractWeekDay('login_time')`** - Extract day of week
4. **`Count('id')`** - Count login records per day
5. **`Response(result)`** - Return the JSON data

---

## Quick Reference

| Import                    | Use For                             |
| ------------------------- | ----------------------------------- |
| `timezone`              | Current date/time (timezone-aware)  |
| `timedelta`             | Date math (adding/subtracting days) |
| `Count`                 | Counting records in queries         |
| `ExtractWeekDay`        | Getting day of week (1-7)           |
| `viewsets.ModelViewSet` | Creating CRUD API endpoints         |
| `@action`               | Adding custom endpoints to ViewSets |
| `Response`              | Returning JSON data from APIs       |
| `PageNumberPagination`  | Splitting results into pages        |

---

## Common Mistakes

❌ **Wrong:** Using `ExtractWeekDay` without importing it

✅ **Right:** `from django.db.models.functions import ExtractWeekDay`

❌ **Wrong:** Using `.volume('weekday')`

✅ **Right:** Using `.values('weekday')`

❌ **Wrong:** Two ViewSets with same basename

✅ **Right:** Specify unique basenames in `router.register()`
