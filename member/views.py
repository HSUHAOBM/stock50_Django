
from member.models import Member
from member.serializers import MemberSerializer
from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.response import Response


# Create your views here.
class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    # permission_classes = (IsAuthenticated,)
    parser_classes = (JSONParser,)

    def get_permissions(self):
        if self.action in ('create',):
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]

    # [GET] api/member/
    def list(self, request, **kwargs):
        users = Member.objects.all()
        serializer = MemberSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    # [POST] api/member/
    def create(self, request, **kwargs):
        name = request.data.get('name')
        users = Member.objects.create(name=name)
        serializer = MemberSerializer(users)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

def member_forum(request):
    return render(request, 'member/member_forum.html')

def member_profile(request):
    return render(request, 'member/member_profile.html')

def member_rank(request):
    return render(request, 'member/member_rank.html')

def member_private(request):
    return render(request, 'member/member_private.html')

def member_register(request):
    return render(request, 'member/member_register.html')

def member_sigin(request):
    return render(request, 'member/member_sigin.html')
