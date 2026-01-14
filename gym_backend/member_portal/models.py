from django.db import models
from django.db.models import F, Index
from django.db.models.functions import Lower,Round
from datetime import datetime

class Member_Portal(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    member_id = models.CharField(max_length=50, unique = True )
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

    class Meta:
        indexes = [
            Index(fields=['first_name']),
            Index(fields=['last_name']),
            Index(fields=['member_id']),
            Index(fields=['expiry_date']),
            Index(fields=['status']),
            Index(fields=['location']),
            Index(fields=['membership']),
            Index(fields=['age']),
            Index(fields=['service']),
            Index(fields=['gender']),
            Index(fields=['join_date']),
        ]


        db_table = 'member_portal_tb'

       
    
    def __str__(self):
        return self.first_name + '' + self.last_name

class MemberLoginRecord(models.Model):
    member = models.ForeignKey(Member_Portal, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    duration = models.DurationField(null=True, blank=True)

    class Meta:
        db_table = 'login_record'

    @property
    def login_date(self):
        return self.login_time.date()

    @property
    def login_time_only(self):
        return self.login_time.time().strftime("%H:%M:%S")
