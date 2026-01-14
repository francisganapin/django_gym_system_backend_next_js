You want to \*\*insert a `MemberLoginRecord` using a serializer\*\*, where the `member` FK is resolved \*\*based on `Member\_Portal.member\_id` (not the PK id)\*\*. This is a very common Django REST Framework pattern 👍



Below are \*\*clean, correct, production-ready approaches\*\*.



---



\## 1️⃣ Models (for reference)



```python

class Member\_Portal(models.Model):

&nbsp;   member\_id = models.CharField(max\_length=50, unique=True)

&nbsp;   # other fields...

```



```python

class MemberLoginRecord(models.Model):

	member = models.ForeignKey(Member\_Portal, on\_delete=models.CASCADE)

	 login\_time = models.DateTimeField(auto\_now\_add=True)

	  logout\_time = models.DateTimeField(null=True, blank=True)

	 duration = models.DurationField(null=True, blank=True)



class Meta:

db\_table = 'login\_record'

```



---



\## 2️⃣ Serializer (BEST PRACTICE)



Use \*\*`SlugRelatedField`\*\* to link via `member\_id`.



\### ✅ Serializer



```python

from rest\_framework import serializers

from .models import MemberLoginRecord, Member\_Portal



class MemberLoginRecordSerializer(serializers.ModelSerializer):

&nbsp;   member\_id = serializers.SlugRelatedField(

&nbsp;       queryset=Member\_Portal.objects.all(),

&nbsp;       slug\_field='member\_id',

&nbsp;       source='member'

&nbsp;   )



&nbsp;   class Meta:

&nbsp;       model = MemberLoginRecord

&nbsp;       fields = \['member\_id', 'login\_time', 'logout\_time', 'duration']

&nbsp;       read\_only\_fields = \['login\_time']

```



\### 🔑 Why this is best



\* No manual `get()` needed

\* Validation is automatic

\* Clean API input

\* Scales well



---



\## 3️⃣ Example API Request (JSON)



```json

{

&nbsp; "member\_id": "MEM-1023"

}

```



➡️ This will create:



```sql

INSERT INTO login\_record (member\_id, login\_time)

VALUES (resolved FK, now());

```



---



\## 4️⃣ View Example



```python

from rest\_framework.views import APIView

from rest\_framework.response import Response

from rest\_framework import status



class LoginRecordCreateView(APIView):

&nbsp;   def post(self, request):

&nbsp;       serializer = MemberLoginRecordSerializer(data=request.data)

&nbsp;       serializer.is\_valid(raise\_exception=True)

&nbsp;       serializer.save()

&nbsp;       return Response(serializer.data, status=status.HTTP\_201\_CREATED)

```



---



\## 5️⃣ Optional: Auto-calculate `duration` on logout



If you're updating logout:



```python

from django.utils.timezone import now



class MemberLogoutSerializer(serializers.ModelSerializer):

&nbsp;   class Meta:

&nbsp;       model = MemberLoginRecord

&nbsp;       fields = \['logout\_time']



&nbsp;   def update(self, instance, validated\_data):

&nbsp;       instance.logout\_time = validated\_data.get('logout\_time', now())

&nbsp;       instance.duration = instance.logout\_time - instance.login\_time

&nbsp;       instance.save()

&nbsp;       return instance

```



---



\## 6️⃣ Common Mistakes ❌



❌ Passing `member\_id` directly into `member`

❌ Using `IntegerField` instead of FK resolution

❌ Manually querying in views (serializer should handle it)



---



\## ✅ Summary



✔ Use `SlugRelatedField`

✔ `source='member'` maps FK correctly

✔ Clean, validated FK insertion

✔ No manual queries



---



If you want:



\* \*\*JWT-based auto member detection\*\*

\* \*\*Login/logout in one endpoint\*\*

\* \*\*Prevent multiple active logins\*\*

\* \*\*Track IP / device / user agent\*\*



Just tell me — this fits very well with your Django practice so far 💪



