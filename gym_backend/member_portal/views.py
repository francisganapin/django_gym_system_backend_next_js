from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import Member_Portal
from .serializers import MemberPortalSerializer
from rest_framework.decorators import api_view
from .serializers import MemberPortalSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class SevenPerPagePagination(PageNumberPagination):
    page_size = 7 
    page_size_query_param = 'page_size'
    max_page_size = 100


    def get_paginated_response(self,data):
        return Response({
            'count':self.page.paginator.count,
            'next':self.get_next_link(),
            'previous':self.get_previous_link(),
            'results':data
        })


class MemberPortalViewSet(viewsets.ModelViewSet):
    queryset = Member_Portal.objects.all()
    serializer_class = MemberPortalSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  
    pagination_class =SevenPerPagePagination