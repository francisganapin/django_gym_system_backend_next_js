from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import Product
from .serializers import ProductPOSSerializer
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from datetime import datetime
from rest_framework.decorators import action

#class SevenPerPagePagination(PageNumberPagination):
#    page_size = 7 
#    page_size_query_param = 'page_size'
#    max_page_size = 100
#    count_expired = Member_Portal.objects.filter(expiry_date__lt = datetime.now()).count()
#    count_active =  Member_Portal.objects.filter(expiry_date__gt = datetime.now()).count()
#    def get_paginated_response(self,data):
#        return Response({
#           'count':self.page.paginator.count,
#            'next':self.get_next_link(),
#           'count_expired':self.count_expired,
#            'count_active':self.count_active,
#            'previous':self.get_previous_link(),
#            'current_page':self.page.number,
#            'total_page':self.page.paginator.num_pages,
#            'results':data
#        })



class ProductPortalViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductPOSSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  
    #pagination_class =SevenPerPagePagination
