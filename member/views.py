from member.models import Profile, PrivateMessage
from django.contrib.auth.models import User, Group

from django.contrib.auth import authenticate, login, logout, get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from member.serializers import UserSerializer, ProfileSerializer, PrivateMessageSerializer
from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from rest_framework.response import Response
from rest_framework.decorators import action

from django.db.models import Q, Sum, Count
from django.contrib.auth.decorators import login_required

import os
import uuid
from django.conf import settings

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = (IsAuthenticated,)
    parser_classes = (JSONParser, MultiPartParser, FormParser)

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
            # 用戶的詳細資料
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

            # 用戶的排行統計https://www.youtube.com/watch?v=cH3_CVCdBAE ---
            total_created_messages = user.created_messages.count()
            successful_created_messages = user.created_messages.filter(check_status='1').count()
            failed_created_messages = user.created_messages.filter(check_status='-1').count()
            # 讚別人次數
            total_likes_given = user.liked_messages.count()
            # 被人讚次數
            total_likes_received = user.created_messages.aggregate(total_likes=Count('likes')).get('total_likes', 0)
            success_rate = 0.0 if total_created_messages == 0 else round(successful_created_messages / total_created_messages, 2)

            user_data['have_rank'] = total_created_messages > 0
            user_data['rank_total_rate'] = success_rate
            user_data['rank_total_win'] = successful_created_messages
            user_data['rank_total_fail'] = failed_created_messages
            user_data['rank_total_total'] = total_created_messages
            user_data['like_total_number'] = total_likes_received

        except Profile.DoesNotExist:
            pass
        return user_data

    # 個人資料修改 /api/User/member_profile/
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=['post'])
    def member_profile(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"ok": False, "message": "無登入!"}, status=status.HTTP_401_OK)

        modify_name = request.data.get("name")

        modify_address = request.data.get("address")
        modify_birthday = request.data.get("birthday")
        modify_gender = request.data.get("gender")

        modify_gender = request.data.get("gender")
        if modify_gender == "Male":
            modify_gender = "M"
        elif modify_gender == "Female":
            modify_gender = "F"
        elif modify_gender == "Other":
            modify_gender = "O"

        modify_interests = request.data.get("interests")
        modify_introduction = request.data.get("introduction")

        # 姓名驗證
        if not modify_name:
            return Response({"ok": False, "message": "姓名不能空。"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.exclude(pk=user.pk).filter(username=modify_name).exists():
            return Response({"ok": False, "message": "該暱稱已被使用。"}, status=status.HTTP_400_BAD_REQUEST)
        if len(modify_name) > 20:
            return Response({"ok": False, "message": "姓名超過20個字。"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 用户的 Profile
            profile = user.profile

            # 更新 Profile
            user.username = modify_name
            profile.address = modify_address
            profile.birthday = modify_birthday
            profile.gender = modify_gender
            profile.interests = modify_interests
            profile.self_intro = modify_introduction

            # 保存
            profile.save()
            user.save()
            serializer = ProfileSerializer(profile)
            return Response({"ok": True, "message": "更新成功", "profile": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"ok": False, "message": f"更新失败: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 個人大頭貼修改 /api/User/member_profile_img/
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=['post'])
    def member_profile_img(self, request):
        user = request.user

        if request.method == "POST":
            try:
                file = request.FILES['member_img_modify']

                if file and allowed_file(file.name):
                    file_extension = os.path.splitext(file.name)[-1]
                    new_filename = f"{uuid.uuid4()}_avatar{file_extension}"
                    file_path = os.path.join(settings.MEDIA_ROOT, 'avatars', new_filename)

                    # 保存文件
                    with open(file_path, 'wb') as dest_file:
                        for chunk in file.chunks():
                            dest_file.write(chunk)

                    if not os.path.exists(file_path):
                        os.makedirs(file_path)

                    if user.profile.avatar_url != "/static/img/peo.png":
                        old_avatar_path = os.path.join(settings.MEDIA_ROOT, user.profile.avatar_url[7:])  # 去掉路径中的 "/media/"
                        if os.path.exists(old_avatar_path):
                            os.remove(old_avatar_path)

                    user.profile.avatar_url = f"/media/avatars/{new_filename}"
                    user.profile.save()
                    user.save()

                    return Response({"ok": True, "message": "更新成功"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"ok": False, "message": "更新失败"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"ok": False, "message": "請選擇圖片"}, status=status.HTTP_400_BAD_REQUEST)

    # 個人訊息傳送與讀取 /api/User/private_message/
    @permission_classes([IsAuthenticated])
    @action(detail=False, methods=['post','get'])
    def private_message(self, request):
        if request.method == 'GET':
            name = request.query_params.get('name', None)
            if request.user.username != name:
                return Response({"Error":True}, status=status.HTTP_200_OK)

            messages = PrivateMessage.objects.filter(receiver=request.user)
            if not messages:  # 如果没有私信
                return Response({"ok":False}, status=status.HTTP_200_OK)
            serializer = PrivateMessageSerializer(messages, many=True)
            return Response({"ok":True , "data":serializer.data}, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            sender = request.user
            receiver_name = request.data.get("receiver_name")
            message_content = request.data.get("message")

            if receiver_name == "administrators":
                administrators_group = Group.objects.get(name="administrators")
                administrators_users = administrators_group.user_set.all()
                for admin_user in administrators_users:
                    message = PrivateMessage(sender=sender, receiver=admin_user, message=message_content)
                    message.save()

                return Response({"ok": True, "message": "訊息成功"}, status=status.HTTP_200_OK)

            try:
                receiver = User.objects.get(username=receiver_name)
            except User.DoesNotExist:
                return Response({"ok": False, "message": "訊息發送失敗"}, status=status.HTTP_400_BAD_REQUEST)

            message = PrivateMessage(sender=sender, receiver=receiver, message=message_content)
            message.save()
        return Response({"ok": True, "message": "訊息成功"}, status=status.HTTP_200_OK)


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



# 頭貼判斷格式
def allowed_file(filename):
    ALLOW_EXTENSIONS = ['png', 'jpg', 'jpeg']
    return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOW_EXTENSIONS
