# Django REST Framework (DRF) Documentation
## Gym Member Portal API

This documentation explains how Django REST Framework works in your Gym Member Portal application.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Flow](#architecture-flow)
3. [Models](#models)
4. [Serializers](#serializers)
5. [Views (ViewSets)](#views-viewsets)
6. [URLs & Routers](#urls--routers)
7. [API Endpoints](#api-endpoints)
8. [Request/Response Examples](#requestresponse-examples)
9. [Pagination](#pagination)

---

## Overview

Django REST Framework (DRF) is a powerful toolkit for building Web APIs. Your gym app uses DRF to create a RESTful API that allows:

- Creating, reading, updating, and deleting gym members
- Recording member login/logout times
- Filtering members by ID
- Paginating results

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **Models** | `models.py` | Define database structure |
| **Serializers** | `serializers.py` | Convert models to/from JSON |
| **Views** | `views.py` | Handle API logic |
| **URLs** | `urls.py` | Route requests to views |

---

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT REQUEST                                 │
│                    POST /api/member_portal/                              │
│                    {"first_name": "John", ...}                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              URLS.PY                                     │
│           router.register(r'member_portal', MemberPortalViewSet)        │
│                         Routes to correct view                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              VIEWS.PY                                    │
│                         MemberPortalViewSet                              │
│                    Handles request, calls serializer                     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERIALIZERS.PY                                  │
│                       MemberPortalSerializer                             │
│               Validates data, converts JSON ↔ Model                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             MODELS.PY                                    │
│                           Member_Portal                                  │
│                    Saves/retrieves from database                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           JSON RESPONSE                                  │
│              {"id": 1, "first_name": "John", ...}                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Models

Models define your database structure. Located in `models.py`.

### Member_Portal Model

```python
class Member_Portal(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    member_id = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    avail = models.CharField(max_length=50)
    expiry_date = models.DateField()
    status = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    membership = models.CharField(max_length=50)
    monthly_fee = models.IntegerField()
    age = models.IntegerField()
    service = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    paid = models.BooleanField(default=False)
    image = models.ImageField(upload_to='member_images')
    join_date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### MemberLoginRecord Model

```python
class MemberLoginRecord(models.Model):
    member = models.ForeignKey(Member_Portal, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)
```

### Field Types Reference

| Field Type | Description | Example |
|------------|-------------|---------|
| `CharField` | Text with max length | `first_name` |
| `IntegerField` | Whole numbers | `age`, `monthly_fee` |
| `DateField` | Date only | `expiry_date` |
| `DateTimeField` | Date and time | `created_at` |
| `BooleanField` | True/False | `paid` |
| `ImageField` | Image file upload | `image` |
| `ForeignKey` | Relationship to another model | `member` |
| `DurationField` | Time duration | `duration` |

---

## Serializers

Serializers convert complex data types (like Django models) to JSON and vice versa. Located in `serializers.py`.

### How Serializers Work

```
┌──────────────┐    Serialization    ┌──────────────┐
│   Python     │ ─────────────────►  │     JSON     │
│   Object     │                     │   Response   │
│  (Model)     │ ◄─────────────────  │   (Request)  │
└──────────────┘   Deserialization   └──────────────┘
```

### MemberPortalSerializer

```python
class MemberPortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member_Portal
        fields = "__all__"  # Include all fields
        extra_kwargs = {
            "member_id": {"required": False},
            "phone_number": {"required": False},
            # ... more optional fields
        }

    def create(self, validated_data):
        # Auto-generate member_id if not provided
        validated_data.setdefault(
            "member_id",
            f"M-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        )
        # Set default values
        validated_data.setdefault("avail", "yes")
        validated_data.setdefault("status", "active")
        return super().create(validated_data)
```

### LoginRecordSerializer

```python
class LoginRecordSerializer(serializers.ModelSerializer):
    member_id = serializers.SlugRelatedField(
        queryset=Member_Portal.objects.all(),  # Look up in Member_Portal
        slug_field='member_id',                 # Match by member_id field
        source='member'                         # Save to member ForeignKey
    )

    class Meta:
        model = MemberLoginRecord
        fields = ['member_id', 'login_time', 'logout_time', 'duration']
        read_only_fields = ['login_time', 'duration']
```

### Serializer Field Options

| Option | Description |
|--------|-------------|
| `required=False` | Field is optional in requests |
| `read_only=True` | Field only appears in responses, not requests |
| `write_only=True` | Field only accepted in requests, not responses |
| `allow_null=True` | Field can be null |
| `default=value` | Default value if not provided |

---

## Views (ViewSets)

Views handle the API logic. ViewSets provide CRUD operations automatically. Located in `views.py`.

### ModelViewSet

`ModelViewSet` automatically provides these actions:

| Action | HTTP Method | URL | Description |
|--------|-------------|-----|-------------|
| `list` | GET | `/api/member_portal/` | Get all members |
| `create` | POST | `/api/member_portal/` | Create new member |
| `retrieve` | GET | `/api/member_portal/{id}/` | Get single member |
| `update` | PUT | `/api/member_portal/{id}/` | Update entire member |
| `partial_update` | PATCH | `/api/member_portal/{id}/` | Partial update |
| `destroy` | DELETE | `/api/member_portal/{id}/` | Delete member |

### MemberPortalViewSet

```python
class MemberPortalViewSet(viewsets.ModelViewSet):
    queryset = Member_Portal.objects.all()          # Data source
    serializer_class = MemberPortalSerializer       # Serializer to use
    permission_classes = [permissions.AllowAny]     # Who can access
    authentication_classes = []                      # No auth required
    pagination_class = SevenPerPagePagination       # Paginate results

    def get_queryset(self):
        """Filter queryset based on query parameters"""
        queryset = Member_Portal.objects.all()
        member_id = self.request.query_params.get('member_id', None)
        if member_id is not None:
            queryset = queryset.filter(member_id=member_id)
        return queryset

    def list(self, request, *args, **kwargs):
        """Custom list action - return single member if member_id provided"""
        member_id = request.query_params.get('member_id', None)
        if member_id:
            try:
                member = Member_Portal.objects.get(member_id=member_id)
                serializer = self.get_serializer(member)
                return Response(serializer.data)
            except Member_Portal.DoesNotExist:
                return Response({'error': f'Member not found'}, status=404)
        return super().list(request, *args, **kwargs)
```

### View Attributes

| Attribute | Purpose |
|-----------|---------|
| `queryset` | Database query for this view |
| `serializer_class` | Which serializer to use |
| `permission_classes` | Who can access (AllowAny, IsAuthenticated, etc.) |
| `authentication_classes` | How to authenticate (Token, Session, etc.) |
| `pagination_class` | How to paginate results |

---

## URLs & Routers

Routers automatically generate URL patterns for ViewSets. Located in `urls.py`.

### DefaultRouter

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'member_portal', views.MemberPortalViewSet)
router.register(r'login_record', views.LoginRecordCreateView)

urlpatterns = [
    path('', include(router.urls)),
]
```

### Generated URLs

The router automatically generates these URL patterns:

| URL Pattern | HTTP Methods | View Action |
|-------------|--------------|-------------|
| `/api/member_portal/` | GET, POST | list, create |
| `/api/member_portal/{id}/` | GET, PUT, PATCH, DELETE | retrieve, update, partial_update, destroy |
| `/api/login_record/` | GET, POST | list, create |
| `/api/login_record/{id}/` | GET, PUT, PATCH, DELETE | retrieve, update, partial_update, destroy |

---

## API Endpoints

### Member Portal Endpoints

#### List All Members
```http
GET /api/member_portal/
```

#### Get Single Member by ID
```http
GET /api/member_portal/?member_id=M-20260113153804
```

#### Create New Member
```http
POST /api/member_portal/
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "membership": "premium"
}
```

#### Update Member
```http
PUT /api/member_portal/1/
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Smith",
    ...all fields required...
}
```

#### Partial Update Member
```http
PATCH /api/member_portal/1/
Content-Type: application/json

{
    "status": "inactive"
}
```

#### Delete Member
```http
DELETE /api/member_portal/1/
```

### Login Record Endpoints

#### Create Login Record
```http
POST /api/login_record/
Content-Type: application/json

{
    "member_id": "M-20260113153804"
}
```

---

## Request/Response Examples

### Creating a Member

**Request:**
```http
POST /api/member_portal/
Content-Type: application/json

{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@gym.com",
    "membership": "gold"
}
```

**Response (201 Created):**
```json
{
    "id": 1,
    "first_name": "Jane",
    "last_name": "Smith",
    "member_id": "M-20260114070000",
    "email": "jane@gym.com",
    "avail": "yes",
    "status": "active",
    "location": "main",
    "membership": "gold",
    "monthly_fee": 0,
    "age": 0,
    "service": "basic",
    "gender": "unspecified",
    "paid": false,
    "expiry_date": "2099-12-31",
    "join_date": "2026-01-14",
    "created_at": "2026-01-14T07:00:00Z",
    "updated_at": "2026-01-14T07:00:00Z"
}
```

### Listing Members (Paginated)

**Request:**
```http
GET /api/member_portal/?page=1
```

**Response (200 OK):**
```json
{
    "count": 25,
    "next": "http://127.0.0.1:8000/api/member_portal/?page=2",
    "previous": null,
    "count_expired": 3,
    "count_active": 22,
    "current_page": 1,
    "total_page": 4,
    "results": [
        {
            "id": 1,
            "first_name": "Jane",
            "last_name": "Smith",
            ...
        },
        ...
    ]
}
```

---

## Pagination

Your app uses custom pagination with 7 items per page.

### SevenPerPagePagination

```python
class SevenPerPagePagination(PageNumberPagination):
    page_size = 7                      # Items per page
    page_size_query_param = 'page_size' # Override with ?page_size=10
    max_page_size = 100                 # Maximum allowed page size

    def get_paginated_response(self, data):
        # Custom response with extra counts
        count_expired = Member_Portal.objects.filter(
            expiry_date__lt=datetime.now()
        ).count()
        count_active = Member_Portal.objects.filter(
            expiry_date__gt=datetime.now()
        ).count()
        
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count_expired': count_expired,
            'count_active': count_active,
            'current_page': self.page.number,
            'total_page': self.page.paginator.num_pages,
            'results': data
        })
```

### Pagination Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `?page=2` |
| `page_size` | Items per page (max 100) | `?page_size=10` |

---

## Common HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE |
| `400` | Bad Request | Validation errors |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Something went wrong |

---

## Quick Reference Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        YOUR GYM APP                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │   ROUTER    │───►│   VIEWSET   │───►│    SERIALIZER       │  │
│  │  urls.py    │    │  views.py   │    │   serializers.py    │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│        │                  │                      │               │
│        │                  │                      │               │
│        ▼                  ▼                      ▼               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                        MODEL                                 ││
│  │                      models.py                               ││
│  │                                                              ││
│  │  Member_Portal ◄────────────────── MemberLoginRecord        ││
│  │  (member_portal_tb)                (login_record)           ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│                    ┌─────────────────┐                          │
│                    │    DATABASE     │                          │
│                    │   (SQLite)      │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Official Documentation Links

- [Django REST Framework](https://www.django-rest-framework.org/)
- [DRF Serializers](https://www.django-rest-framework.org/api-guide/serializers/)
- [DRF ViewSets](https://www.django-rest-framework.org/api-guide/viewsets/)
- [DRF Routers](https://www.django-rest-framework.org/api-guide/routers/)
- [DRF Pagination](https://www.django-rest-framework.org/api-guide/pagination/)
