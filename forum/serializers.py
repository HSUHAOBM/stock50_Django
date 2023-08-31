from rest_framework import serializers
from forum.models import MessageBoard


class MessageBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageBoard
        fields = '__all__'
