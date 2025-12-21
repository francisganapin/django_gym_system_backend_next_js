from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import Member_Portal
from .serializers import MemberPortalSerializer
from rest_framework.decorators import api_view
from .serializers import MemberPortalSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from datetime import datetime
from rest_framework.decorators import action

class SevenPerPagePagination(PageNumberPagination):
    page_size = 7 
    page_size_query_param = 'page_size'
    max_page_size = 100
    count_expired = Member_Portal.objects.filter(expiry_date__lt = datetime.now()).count()
    count_active =  Member_Portal.objects.filter(expiry_date__gt = datetime.now()).count()
    def get_paginated_response(self,data):
        return Response({
            'count':self.page.paginator.count,
            'next':self.get_next_link(),
            'count_expired':self.count_expired,
            'count_active':self.count_active,
            'previous':self.get_previous_link(),
            'current_page':self.page.number,
            'total_page':self.page.paginator.num_pages,
            'results':data
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