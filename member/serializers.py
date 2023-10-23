from rest_framework import serializers
from rest_framework.settings import api_settings
from member.models import Profile
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'
        # fields = ('',)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        # fields = ('id', 'username', 'email', 'password', 'profile')
        fields = ('id', 'username', 'email', 'password')

        extra_kwargs = {
            'password': {'write_only': True}
        }


class UserBoardSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(source='profile.avatar_url', read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'avatar_url')

