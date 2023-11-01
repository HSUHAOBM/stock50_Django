from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.decorators import login_required
from django.db.models import F

# Create your views here.
from forum.models import MessageBoard, MessageBoardReply
from forum.serializers import MessageBoardSerializer, MessageBoardReplySerializer

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.decorators import action, api_view, permission_classes

from django.contrib.auth.decorators import login_required

from stock.models import Stock, StockStopDealDate

from datetime import datetime, date, time
from django.utils import timezone

# Create your views here.
class MessageBoardViewSet(viewsets.ModelViewSet):
    queryset = MessageBoard.objects.all()
    serializer_class = MessageBoardSerializer
    parser_classes = (JSONParser,)
    permission_classes = [IsAuthenticated]

    # 留言建立
    def create(self, request, **kwargs):
        stock = request.data.get("predict_stock")
        stock_code = stock.split("－")[0]
        trend = request.data.get("predict_trend")
        message = request.data.get("predict_message")

        if len(message.strip()) == 0:
            return Response({"ok": False, "message": "檢查輸入是否為空白"}, status=status.HTTP_401_UNAUTHORIZED)
        elif(len(message) > 200):
            return Response({"ok": False, "message": "留言字數超過 200"}, status=status.HTTP_401_UNAUTHORIZED)

        if(trend == "漲"):
            trend = "1"
        elif(trend == "跌"):
            trend = "-1"
        elif(trend == "持平"):
            trend = "0"

        stock_instance = Stock.objects.get(code=stock_code)

        print("現在時間為：", timezone.localtime().strftime("%Y-%m-%d %H:%M:%S"))

        # 檢查時間
        if is_between_1_to_2_pm():
            return Response({"ok": False, "message": "為公平起見，下午13時至14時，不能新增留言。"}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user

        # 當回發布次數,總、個股
        user_trend_total_count = MessageBoard.objects.filter(create_id=user,check_status=None).count()
        user_trend_stock_count = MessageBoard.objects.filter(create_id=user, stock_id=stock_instance).count()
        if user_trend_total_count > 3:
            return Response({"ok": False, "message": "本回次數已達上限，明日再試。"}, status=status.HTTP_401_UNAUTHORIZED)

        if user_trend_stock_count >= 1:
            return Response({"ok": False, "message": f"{stock_instance.name}，本回已發佈，明日再試。"}, status=status.HTTP_401_UNAUTHORIZED)

        message = MessageBoard.objects.create(
            stock=stock_instance,
            stock_status=trend,
            text=message,
            create_id=user,
            write_id=user
        )
        return Response({"ok": True, "mid" : message.id, "time":datetime.now().strftime('%Y-%m-%d %H:%M:%S') }, status=status.HTTP_401_UNAUTHORIZED)

    def list(self,request, **kwargs):
        # 使用者
        user_name = request.query_params.get("user_name", None)
        # 股票
        stock_id = request.query_params.get("stock_id", None)
        # 頁數, 1 頁 有 10 筆
        page = int(request.query_params.get("page", 0))
        records_per_page = 10
        offset = page * records_per_page

        # 條件
        conditions = {}

        # 指定用户
        if user_name:
            conditions["create_id__username"] = user_name

        # 指定股票
        if stock_id:
            conditions["stock__code"] = stock_id
        # # 數量
        # count = MessageBoard.objects.filter(**conditions).count()
        # if count == 0:
        #     return Response({"message": "No data available."}, status=status.HTTP_204_NO_CONTENT)

        # conditions = 空, 全取
        message_board = MessageBoard.objects.filter(**conditions).order_by('-create_date')[offset:offset + records_per_page]
        if not message_board:
            return Response({"ok":False, "message": "No data available."}, status=status.HTTP_200_OK)
        serializer = MessageBoardSerializer(message_board, many=True)

        # 登入者 // 並判斷有無按讚
        current_user = request.user
        for item in serializer.data:
            item['current_user_likes'] = MessageBoard.objects.filter(pk=item['id'], likes=current_user).exists()

        return Response(serializer.data, status=status.HTTP_200_OK)


    # 讚新增與取消 /api/forum/like/
    @action(detail=False, methods=['POST'])
    def like(self, request):

        user = request.user

        message_id = request.data.get("message_mid_like")
        message_id = message_id.split("mid_")[-1]
        message_like = request.data.get("status")

        maessage = MessageBoard.objects.get(pk=message_id)

        if message_like == "like":
            maessage.likes.add(user)
        else:
            maessage.likes.remove(user)

        return Response({"ok": True, "message": f"{message_like}成功"}, status=status.HTTP_201_CREATED)


# 首頁
def main(request):
    return render(request, "forum/index.html")
# 關於本站
def about(request):
    return render(request, "forum/about.html")
# 討論
@login_required
def forum(request):
    return_stock_data = Stock.objects.all().order_by("code")
    return render(request, "forum/forum.html", {"stock_data": return_stock_data})


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)

# def forum_test(request):
#     print(request.user.is_authenticated)
#     return JsonResponse({"message": "用戶有有效的tokenen}"})

class MessageBoardReplyViewSet(viewsets.ModelViewSet):
    queryset = MessageBoardReply.objects.all().order_by('-create_date')
    serializer_class = MessageBoardReplySerializer
    parser_classes = (JSONParser,)
    permission_classes = [IsAuthenticated]

    # 留言回覆建立
    def create(self, request, **kwargs):
        message_id = request.data.get("message_mid")
        message_id = message_id.split("mid_")[-1]

        message_text = request.data.get("message_reply_text")

        if len(message_text.strip()) == 0:
            return Response({"ok": False, "message": "檢查輸入是否為空白"}, status=status.HTTP_401_UNAUTHORIZED)
        elif(len(message_text) > 50):
            return Response({"ok": False, "message": "留言字數超過 50"}, status=status.HTTP_401_UNAUTHORIZED)


        maessage = MessageBoard.objects.get(pk=message_id)
        current_user = request.user
        maessage_reply = MessageBoardReply.objects.create(message=maessage, text=message_text, create_id=current_user)
        # maessage_reply = MessageBoardReply()
        # maessage_reply.message = maessage
        # maessage_reply.text = message_text
        # maessage_reply.create_id = current_user
        # maessage_reply.save()
        return Response({"ok": True, "message": "留言回复成功", "reply_id" : maessage_reply.id}, status=status.HTTP_201_CREATED)


# 留言資格判斷
def is_deal_date_today():
    today = timezone.localdate()
    is_weekend = today.weekday() in [5, 6]
    if is_weekend:
        return False
    else:
        try:
            stop_deal_date = StockStopDealDate.objects.get(date=today)
            return True
        except StockStopDealDate.DoesNotExist:
            return False

def is_between_1_to_2_pm():
    if is_deal_date_today():
        return False
    current_time = timezone.localtime().time()
    start_time = time(13, 0)  # 13:00
    end_time = time(14, 0)    # 14:00

    return start_time <= current_time <= end_time