from member.models import Profile
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from member.serializers import UserSerializer
from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.decorators import action

from django.db.models import Q
from django.contrib.auth.decorators import login_required

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (IsAuthenticated,)
    parser_classes = (JSONParser,)

    # def get_permissions(self):
    #     if self.action in ('create',):
    #         self.permission_classes = [IsAuthenticated]
    #     return [permission() for permission in self.permission_classes]

    @permission_classes([IsAdminUser])
    def list(self, request, **kwargs):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, **kwargs):
        member_name = request.data.get('member_name')
        member_email = request.data.get('member_email')
        member_password = request.data.get('member_password')

        if not member_email.strip() or not member_password.strip() or not member_name.strip():
            return Response({'error': True, 'message': 'Please fill in all fields'}, status=status.HTTP_400_BAD_REQUEST)

        if len(member_name) > 10 or len(member_password) < 6 or len(member_password) > 12:
            return Response({'error': True, 'message': 'Invalid username or password length'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if User.objects.filter(email=member_email).exists():
                return Response({"ok": False, "message": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=member_name).exists():
                return Response({"ok": False, "message": "Name already exists"}, status=status.HTTP_400_BAD_REQUEST)

            new_user = User.objects.create_user(username=member_name, email=member_email, password=member_password)
            new_user.save()

            return Response({"ok": True, "message": "註冊成功!"}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"ok": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 登入 /api/User/login/
    @permission_classes([AllowAny])
    @action(detail=False, methods=['post'])
    def login(self, request):

        member_email = request.data.get('member_email')
        member_password = request.data.get('member_password')

        UserModel = get_user_model()

        user = UserModel.objects.filter(Q(email=member_email)).first()
        if user:
            if user.check_password(member_password):
                user.profile.last_login_ip = request.META.get('REMOTE_ADDR')
                # user.profile.last_login_ip = request.META.get('HTTP_X_FORWARDED_FOR')
                user.profile.save()  # 更新 last_login_ip

                login(request, user)
                return Response({"ok": True, "message": "登入成功!", "name":user.get_username()}, status=status.HTTP_201_CREATED)
            else:
                return Response({"ok": False, "message": "登入失敗!"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            UserModel().set_password(member_password)
            return Response({"ok": False, "message": "登入失敗!"}, status=status.HTTP_401_UNAUTHORIZED)

    # 登出用户 /api/User/logout/
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=['get'])
    def logout(self, request):
        logout(request)
        return Response({"ok": True, 'detail': 'Logout successful'}, status=status.HTTP_200_OK)

    # 登入檢查 /api/User/check/
    @action(detail=False, methods=['get'])
    def check(self, request):
        user = request.user
        if not request.user.is_authenticated: return Response({"ok": False, "message": "無登入"}, status=status.HTTP_401_UNAUTHORIZED)

        name_param = request.query_params.get("name")

        if name_param == user.username or not name_param:
            user_data = self._get_user_data(user)
            user_data['is_self'] = True
            return Response(user_data, status=status.HTTP_200_OK)
        else:
            try:
                other_user = User.objects.get(username=name_param)
                user_data = self._get_user_data(other_user)
                user_data['is_self'] = False
                return Response(user_data, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                return Response({"ok": False, "message": "無此會員!"}, status=status.HTTP_401_UNAUTHORIZED)

    def _get_user_data(self, user):
        user_data = {
            "ok": True,
            'username': user.username,
            'email': user.email,
            'last_login':user.last_login.strftime('%Y-%m-%d'),
            'is_superuser:':user.is_superuser
        }
        try:
            # 在這裡獲取用戶的詳細資料
            profile = user.profile
            if profile.birthday:
                user_data['birthday'] = profile.birthday.strftime('%Y-%m-%d')
            else:
                user_data['birthday'] = None

            if profile.gender =="M":
                user_data['gender'] = "Male"
            elif profile.gender =="F":
                user_data['gender'] = "Female"
            else:
                user_data['gender'] = "未設置"

            user_data['address'] = profile.address
            user_data['interests'] = profile.interests
            user_data['avatar_url'] = profile.avatar_url
            user_data['self_intro'] = profile.self_intro
            user_data['last_login_ip'] = profile.last_login_ip
            user_data['create_date'] = profile.create_date.strftime('%Y-%m-%d %H:%M:%S')
            user_data['write_date'] = profile.write_date
            user_data['type'] = profile.type
            # 排行
            # rank = user.rank
            user_data['have_rank'] = False
            user_data['rank_total_rate'] = "0"
            user_data['rank_total_win'] = "0"
            user_data['rank_total_fail'] = "0"
            user_data['rank_total_total'] = "0"
            user_data['like_total_number'] = "0"

        except Profile.DoesNotExist:
            pass
        return user_data


@login_required
def member_forum(request):
    return render(request, 'member/member_forum.html')

@login_required
def member_profile(request):
    return render(request, 'member/member_profile.html')

@login_required
def member_rank(request):
    return render(request, 'member/member_rank.html')

@login_required
def member_private(request):
    return render(request, 'member/member_private.html')

def member_register(request):
    if not request.user.is_authenticated:
        return render(request, 'member/member_register.html')
    else:
        return render(request, 'forum/forum.html')
def member_sigin(request):
    if not request.user.is_authenticated:
        return render(request, 'member/member_sigin.html')
    else:
        return render(request, 'forum/forum.html')
