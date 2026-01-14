Great question — this is exactly what you need for **weekly charts** 👍
You identify **Monday–Friday** from `login_time` using Django’s date functions.

Below are  **two clean ways** . Use **Option A** (recommended).

---

## ✅ OPTION A (BEST): Annotate weekday name (Mon–Sun)

Django gives weekday numbers automatically.

### **views.py**

```python
from django.db.models import Count
from django.db.models.functions import TruncDate, ExtractWeekDay
from rest_framework.decorators import action
from django.utils import timezone
from datetime import timedelta
from rest_framework.response import Response

class MemberLoginRecordViewSet(viewsets.ModelViewSet):
    queryset = MemberLoginRecord.objects.all()
    serializer_class = LoginRecordSerializer

    @action(detail=False, methods=['get'], url_path='weekly-summary')
    def weekly_summary(self, request):
        today = timezone.now()
        week_start = today - timedelta(days=today.weekday())  # Monday
        week_end = week_start + timedelta(days=6)

        data = (
            MemberLoginRecord.objects
            .filter(login_time__date__range=[week_start.date(), week_end.date()])
            .annotate(weekday=ExtractWeekDay('login_time'))
            .values('weekday')
            .annotate(count=Count('id'))
            .order_by('weekday')
        )

        # Convert weekday numbers to names
        weekday_map = {
            2: "Monday",
            3: "Tuesday",
            4: "Wednesday",
            5: "Thursday",
            6: "Friday",
        }

        result = [
            {
                "day": weekday_map.get(item["weekday"], "Weekend"),
                "count": item["count"]
            }
            for item in data
            if item["weekday"] in weekday_map
        ]

        return Response(result)
```

---

## ✅ Weekday number mapping (IMPORTANT)

Django `ExtractWeekDay` returns:

| Number | Day       |
| ------ | --------- |
| 1      | Sunday    |
| 2      | Monday    |
| 3      | Tuesday   |
| 4      | Wednesday |
| 5      | Thursday  |
| 6      | Friday    |
| 7      | Saturday  |

That’s why we map **2–6** only.

---

## ✅ Sample API Response

```json
[
  { "day": "Monday", "count": 3 },
  { "day": "Tuesday", "count": 5 },
  { "day": "Wednesday", "count": 2 },
  { "day": "Thursday", "count": 6 },
  { "day": "Friday", "count": 4 }
]
```

Perfect for bar charts 📊

---

## 🟢 OPTION B (Frontend mapping – simpler API)

If you want the backend  **simpler** , return numbers only:

```python
.values('weekday')
```

Then in React:

```js
const days = {
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
};
```

---

## ✅ Recommendation for YOU

✔ Use **Option A** for dashboards
✔ Keep **login_time only** in DB
✔ Never store weekday strings in database

This is **clean, scalable, and professional** Django REST design.

---

If you want next:

* React chart (Recharts / Chart.js)
* Weekly summary per **member**
* Month-to-date login heatmap 🔥

Just say the word 👍
