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

# 首頁
def main(request):
    return render(request, 'forum/index.html')
# 關於本站
def about(request):
    return render(request, 'forum/about.html')
# 討論
def forum(request):
    return render(request, 'forum/forum.html')

