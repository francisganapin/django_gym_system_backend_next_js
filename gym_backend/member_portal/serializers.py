from .models import Member_Portal,MemberLoginRecord
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
            'email':{'required':False},
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


class LoginRecordSerializer(serializers.ModelSerializer):
    member_id = serializers.SlugRelatedField(
        queryset = Member_Portal.objects.all(),
        slug_field='member_id',
        source='member'
    )


    login_date_time = serializers.SerializerMethodField()
    logout_date_time = serializers.SerializerMethodField()
    duration_readable = serializers.SerializerMethodField()




    class Meta:
        model = MemberLoginRecord
        fields = ['member_id', 'login_time', 'logout_time', 'duration',
        'login_date_time',
        'logout_date_time',
        'duration_readable'
        
        ]

        read_only_fields = ['login_time', 'duration','login_date_time','logout_date_time','duration_readable']

       # Methods must be inside the class
    def get_login_date_time(self, obj):
        return obj.login_time.strftime("%Y-%m-%d, %A, %H:%M")



    def get_logout_date_time(self,obj):
        if obj.logout_time:
            return obj.logout_time.strftime('%Y-%m-%d %A, %H:%M')
        return None

    def get_duration_readable(self,obj):
        if obj.duration:
            total_seconds = int(obj.duration.total_seconds())
            days,remainder = divmod(total_seconds, 86400)
            hours,remainder = divmod(remainder, 3600)
            minutes,seconds = divmod(remainder, 60)
            return f'{days} days, {hours} hours, {minutes} minutes, {seconds} seconds'
        return None

    
