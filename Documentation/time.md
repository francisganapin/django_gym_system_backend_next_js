Ah, I see what you want! You want your `MemberLoginRecord` to **store the login and logout times** (which it already does) and also **display them in a way that shows date, days, and time**, maybe like `"2026-01-14, Wednesday, 14:30"` or `"2 days, 5 hours"` for duration. Let me break this down.

### 1️⃣ Show **Login Date and Time**

You already have:

```python
login_time = models.DateTimeField(auto_now_add=True)
```

This stores the exact date and time. To **display it in a friendly format**, you can create a property in your model:

```python
from django.utils import timezone

class MemberLoginRecord(models.Model):
    member = models.ForeignKey(Member_Portal, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    class Meta:
        db_table = 'login_record'

    @property
    def login_date_time(self):
        # Format: "YYYY-MM-DD, DayOfWeek, HH:MM"
        return self.login_time.strftime("%Y-%m-%d, %A, %H:%M")

    @property
    def logout_date_time(self):
        if self.logout_time:
            return self.logout_time.strftime("%Y-%m-%d, %A, %H:%M")
        return None

    @property
    def duration_readable(self):
        if self.duration:
            total_seconds = int(self.duration.total_seconds())
            days, remainder = divmod(total_seconds, 86400)
            hours, remainder = divmod(remainder, 3600)
            minutes, seconds = divmod(remainder, 60)
            return f"{days}d {hours}h {minutes}m {seconds}s"
        return None
```

✅ What this does:

* `login_date_time` → shows something like `"2026-01-14, Tuesday, 14:30"`.
* `logout_date_time` → same as above for logout (if available).
* `duration_readable` → shows total duration in days, hours, minutes, seconds like `"0d 5h 23m 12s"`.

---

### 2️⃣ Using in Django Admin

If you want this to **show in Django Admin list view**, you can add:

```python
from django.contrib import admin

@admin.register(MemberLoginRecord)
class MemberLoginRecordAdmin(admin.ModelAdmin):
    list_display = ('member', 'login_date_time', 'logout_date_time', 'duration_readable')
```

---

### 3️⃣ Using in Serializer (if API)

If you are using DRF:

```python
from rest_framework import serializers

class MemberLoginRecordSerializer(serializers.ModelSerializer):
    login_date_time = serializers.CharField(source='login_date_time', read_only=True)
    logout_date_time = serializers.CharField(source='logout_date_time', read_only=True)
    duration_readable = serializers.CharField(source='duration_readable', read_only=True)

    class Meta:
        model = MemberLoginRecord
        fields = ['member', 'login_date_time', 'logout_date_time', 'duration_readable']
```

---

This way, your API or frontend will show **full date, day, time, and duration in a readable format**.

If you want, I can also make it **automatically calculate duration whenever logout is saved**, so you never have to do it manually. This is very handy for login/logout tracking.

Do you want me to do that?
