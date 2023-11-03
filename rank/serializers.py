from rest_framework import serializers
from rest_framework.settings import api_settings
from member.models import Profile
from django.contrib.auth.models import User
from .models import Rank

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = '__all__'
        # fields = ('',)