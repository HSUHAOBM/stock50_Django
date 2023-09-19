from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.decorators import login_required

# Create your views here.
from forum.models import MessageBoard
from forum.serializers import MessageBoardSerializer

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required

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


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

# def forum_test(request):
#     print(request.user.is_authenticated)
#     return JsonResponse({"message": "用戶有有效的tokenen}"})
