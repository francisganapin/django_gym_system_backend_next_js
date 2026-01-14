If your API endpoint:

```
http://127.0.0.1:8000/api/member_portal
```

is asking for  **authentication** , it means Django REST Framework is using its  **default global permissions** .

To make your serializer/view/viewset  **NOT require authentication** , you must override the  **permission_classes** .

---

# ✅ **OPTION 1 — Disable auth only for this ViewSet (recommended)**

In your  **views.py** :

```python
from rest_framework import viewsets, permissions
from .models import Member_Portal
from .serializers import MemberPortalSerializer

class MemberPortalViewSet(viewsets.ModelViewSet):
    queryset = Member_Portal.objects.all()
    serializer_class = MemberPortalSerializer
    permission_classes = [permissions.AllowAny]  # 🔥 No auth required!
```

✔ Anyone can GET, POST, PUT, DELETE

✔ No login

✔ No token required

---

# ✅ **OPTION 2 — If you use function-based views**

Add:

```python
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def member_portal(request):
    ...
```

Make sure to import:

```python
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
```

---

# ✅ **OPTION 3 — Disable authentication for the whole API (global settings)**

In  **settings.py** :

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}
```

✔ All DRF endpoints = public

✔ No auth required everywhere

❗ Only use in development, not production

---

# ⚠️ Important

**Serializers NEVER require authentication.**

Authentication is controlled by:

* ViewSet
* APIView
* Function-based views
* Global settings

So the fix always happens in  **views** , not serializers.

---

# If you want, I can check your `views.py` and `settings.py` to make sure authentication is fully disabled. 

You're still getting:

```
{
    "detail": "Invalid username/password."
}
```

This means  **Django REST Framework is still enforcing authentication** .

That error message  **ONLY comes from BasicAuthentication** , so even if you removed permissions, your API is still trying to authenticate the user.

---

# ✅ **THERE ARE ONLY 3 POSSIBLE CAUSES**

I will show how to fix all.

---

# ✅ **CAUSE 1 — Your GLOBAL settings are still forcing authentication**

Check  **settings.py** .

If you see something like:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

Then EVERYTHING requires login.

---

# ✅ **FIX: Disable Authentication Globally (DEV)**

In `settings.py`, change it to:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
```

✔ No login required

✔ No username/password prompt

---

# ✅ **CAUSE 2 — Your ViewSet still has authentication classes**

In your `views.py`, you MUST add:

### 🔥 FIX THIS

```python
permission_classes = [permissions.AllowAny]
authentication_classes = []   # ← THIS IS IMPORTANT
```

Full:

```python
from rest_framework import viewsets, permissions

class MemberPortalViewSet(viewsets.ModelViewSet):
    queryset = Member_Portal.objects.all()
    serializer_class = MemberPortalSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # 🔥 Disable BasicAuth + SessionAuth
```

Without `authentication_classes = []`, DRF will STILL try to authenticate using BasicAuth.

---

# ✅ **CAUSE 3 — You're using the `/api/` prefix that forces login (common mistake)**

Some templates or DRF configurations include:

```python
path('api-auth/', include('rest_framework.urls'))
```

This does NOT protect endpoints but makes your browser send **BasicAuth headers automatically** if you've ever logged into /admin.

Browser sends “Authorization: Basic …”, DRF sees wrong credentials →  **Invalid username/password** .

You can test:

👉 Try opening the URL in  **Incognito Mode** .

If it works: the browser is auto-sending old credentials.

---

# 🚀 QUICK FIX (WORKS IMMEDIATELY)

Put this in your ViewSet:

```python
authentication_classes = []
permission_classes = [permissions.AllowAny]
```

Restart your server:

```
ctrl + C
python manage.py runserver
```

Then test again:

```
http://127.0.0.1:8000/api/member_portal
```

✔ Should no longer ask login

✔ No “Invalid username/password.” error

✔ Fully public endpoint

---

# 💬 If you want, I can check your `settings.py`, `views.py`, and `urls.py` to confirm the correct configuration.
