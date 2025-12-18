from .models import Member_Portal
from rest_framework import serializers
from datetime import datetime

class MemberPortalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member_Portal
        fields = "__all__"
        extra_kwargs = {
            "member_id": {"required": False},
            "phone_number": {"required": False},
            "avail": {"required": False},
            "expiry_date": {"required": False},
            "status": {"required": False},
            "location": {"required": False},
            "membership": {"required": False},
            "monthly_fee": {"required": False},
            "age": {"required": False},
            "service": {"required": False},
            "gender": {"required": False},
            "image": {"required": False, "allow_null": True},
        }

    def create(self, validated_data):
        validated_data.setdefault(
            "member_id",
            f"M-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        )
        validated_data.setdefault("avail", "yes")
        validated_data.setdefault("status", "active")
        validated_data.setdefault("location", "main")
        validated_data.setdefault("monthly_fee", 0)
        validated_data.setdefault("age", 0)
        validated_data.setdefault("service", "basic")
        validated_data.setdefault("gender", "unspecified")
        validated_data.setdefault("expiry_date", "2099-12-31")

        return super().create(validated_data)
