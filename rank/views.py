from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest

# Create your views here.
from forum.models import MessageBoard
from forum.serializers import MessageBoardSerializer

from rest_framework import viewsets


# Create your views here.
class MessageBoardViewSet(viewsets.ModelViewSet):
    queryset = MessageBoard.objects.all()
    serializer_class = MessageBoardSerializer

# 排行
def rank(request):
    return render(request, 'rank/index.html')


