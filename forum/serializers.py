from rest_framework import serializers
from forum.models import MessageBoard,  MessageBoardReply
from member.serializers import UserBoardSerializer
from stock.serializers import StockSerializer

class MessageBoardReplySerializer(serializers.ModelSerializer):
    create_id = UserBoardSerializer()
    create_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = MessageBoardReply
        fields = '__all__'

class MessageBoardSerializer(serializers.ModelSerializer):
    create_id = UserBoardSerializer()
    stock = StockSerializer()
    replies = MessageBoardReplySerializer(many=True)  # 嵌套序列化 MessageBoardReply
    likes = UserBoardSerializer(many=True)
    create_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = MessageBoard
        fields = '__all__'

