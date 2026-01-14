from django.urls import path,include 
from rest_framework import routers
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'member_portal', views.MemberPortalViewSet)

# Individual login records endpoint
router.register(r'login-records', views.LoginRecordCreateView, basename='login-record')



urlpatterns = [
    path('', include(router.urls)),
]