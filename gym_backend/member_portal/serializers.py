from .models import Member_Portal
from rest_framework import serializers


class MemberPortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member_Portal
        fields = '__all__'