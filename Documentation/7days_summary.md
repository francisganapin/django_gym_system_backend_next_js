Ah! Now I understand — you want to  **calculate and display logins over the past 7 days** , like a report or API endpoint, but without having a separate `login_date` field in the database. That’s totally fine — you can use your  **existing `login_time` field** .

Here’s how:

---

### **1️⃣ Query logins in the past 7 days**

```python
from datetime import datetime, timedelta
from member_portal.models import MemberLoginRecord

# Get the date 7 days ago
seven_days_ago = datetime.now() - timedelta(days=7)

# Query all logins in the last 7 days
recent_logins = MemberLoginRecord.objects.filter(login_time__gte=seven_days_ago)

print(recent_logins)
```

* `login_time__gte=seven_days_ago` → “login_time greater than or equal to 7 days ago”
* You can replace `datetime.now()` with `timezone.now()` if you’re using Django timezones.

---

### **2️⃣ Count logins per day**

If you want a **summary of logins per day** in the past week:

```python
from django.db.models.functions import TruncDate
from django.db.models import Count
from django.utils import timezone

today = timezone.now()
seven_days_ago = today - timedelta(days=7)

login_summary = (
    MemberLoginRecord.objects
    .filter(login_time__gte=seven_days_ago)
    .annotate(day=TruncDate('login_time'))  # truncate datetime to date
    .values('day')  # group by day
    .annotate(count=Count('id'))  # count logins per day
    .order_by('day')
)

for record in login_summary:
    print(f"{record['day']}: {record['count']} logins")
```

✅ This will output something like:

```
2026-01-08: 3 logins
2026-01-09: 5 logins
2026-01-10: 2 logins
...
```

---

### **3️⃣ Use in Django REST API**

You can create a **serializer or endpoint** to return login counts per day:

```python
from rest_framework.views import APIView
from rest_framework.response import Response

class LoginSummary7Days(APIView):
    def get(self, request):
        today = timezone.now()
        seven_days_ago = today - timedelta(days=7)
      
        login_summary = (
            MemberLoginRecord.objects
            .filter(login_time__gte=seven_days_ago)
            .annotate(day=TruncDate('login_time'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
      
        return Response(login_summary)
```

* This will give a JSON response with **day + number of logins** for the past 7 days.

---

### ✅ Key Points

* You **don’t need a separate `login_date` field** — you can always truncate `login_time` to date.
* Django’s `TruncDate` + `Count` is perfect for  **grouping logins by day** .
* Works for any date range, not just 7 days.

---

If you want, I can **write a full example** where your `MemberLoginRecord` model + serializer + API endpoint **returns last 7 days login summary** directly in JSON, ready to use in your React frontend.

Do you want me to do that?
