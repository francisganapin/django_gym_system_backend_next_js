from django.shortcuts import render
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate, ExtractWeekDay  # ← Add ExtractWeekDay here
from datetime import datetime, timedelta

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Member_Portal, MemberLoginRecord
from .serializers import MemberPortalSerializer, LoginRecordSerializer



class SevenPerPagePagination(PageNumberPagination):
    page_size = 7 
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        # Calculate counts at request time, not at import time
        count_expired = Member_Portal.objects.filter(expiry_date__lt=datetime.now()).count()
        count_active = Member_Portal.objects.filter(expiry_date__gt=datetime.now()).count()
        
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'count_expired': count_expired,
            'count_active': count_active,
            'previous': self.get_previous_link(),
            'current_page': self.page.number,
            'total_page': self.page.paginator.num_pages,
            'results': data
        })



class MemberPortalViewSet(viewsets.ModelViewSet):
    queryset = Member_Portal.objects.all()
    serializer_class = MemberPortalSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  
    pagination_class =SevenPerPagePagination



    def get_queryset(self):
        queryset = Member_Portal.objects.all()
        member_id = self.request.query_params.get('member_id',None)
        if member_id is not None:
            queryset = queryset.filter(member_id=member_id)
        
        return queryset

    def list(self,request,*args,**kwargs):

        member_id = request.query_params.get('member_id',None)

        if member_id:
            try:
                member = Member_Portal.objects.get(member_id=member_id)
                serializer = self.get_serializer(member)
                return Response(serializer.data)
            except Member_Portal.DoesNotExist:
                 return Response(
                    {'error': f'Member with ID {member_id} not found'},
                    status=404
                )
        

        return super().list(request,*args,**kwargs)

class LoginRecordCreateView(viewsets.ModelViewSet):
    queryset = MemberLoginRecord.objects.all()
    serializer_class = LoginRecordSerializer

    @action(detail=False,methods=['get'],url_path='weekly-summary')
    def weekly_summary(self,request):
        today = timezone.now()
        week_start = today - timedelta(days=today.weekday())
        week_end = week_start + timedelta(days=6)

        data = (
            MemberLoginRecord.objects
            .filter(login_time__date__range=[week_start.date(),week_end.date()])
            .annotate(weekday=ExtractWeekDay('login_time'))
            .values('weekday')
            .annotate(count=Count('id'))
            .order_by('weekday')
        )

        weekday_map = {
            0:'Monday',
            1:'Tuesday',
            2:'Wednesday',
            3:'Thursday',
            4:'Friday',
            5:'Saturday',
            6:'Sunday',
        }

        result = [
            {
                'day':weekday_map.get(item['weekday'],'Weekend'),
                'count':item['count']
            }
            for item in data
            if item['weekday'] in weekday_map
        ]

        return Response(result)


class MemberLoginRecordViewSet(viewsets.ModelViewSet):
    queryset = MemberLoginRecord.objects.all()
    serializer_class = LoginRecordSerializer

   