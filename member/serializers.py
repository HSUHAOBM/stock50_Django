from rest_framework import serializers
from rest_framework.settings import api_settings
from member.models import Member

class MemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = Member
        fields = '__all__'
        # fields = ('',)