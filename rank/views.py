from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest

# Create your views here.
from forum.models import MessageBoard
from stock.models import Stock

from forum.serializers import MessageBoardSerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Count, Case, When, IntegerField, Value, F, ExpressionWrapper, FloatField
from django.db.models.functions import Round, Cast

# 排行
@login_required
def rank(request):
    return render(request, 'rank/index.html')


class RankView(APIView):
    def get(self, request):
        # status = request.query_params.get("status", None)
        name = request.query_params.get("name", None)
        stock = request.query_params.get("stock", None)

        # 指定股票
        if stock:
            stock = get_object_or_404(Stock, code=stock)
            stock_message = stock.stock_messages

            stock_message_user = stock_message.values(
                username=F('create_id__username'),
                user_img=F('create_id__profile__avatar_url')
            ).annotate(
                total_messages=Count('create_id'),
                successful_messages=Count(Case(When(check_status='1', then=Value(1)), output_field=IntegerField())),
                failed_messages=Count(Case(When(check_status='-1', then=Value(1)), output_field=IntegerField())),
                success_rate=ExpressionWrapper(
                    # 整數
                    Cast(F('successful_messages') * 100.0 / F('total_messages'), IntegerField()),
                    # 小數第二位
                    # Round(Cast(F('successful_messages') * 100.0 / F('total_messages'), FloatField()), 2),
                    output_field=IntegerField()
                )
            ).order_by('-success_rate', '-total_messages')
            # 簡單取值和排序
            # for entry in stock_message_user:
            #     entry['success_rate'] = round(entry['successful_messages'] / entry['total_messages'], 2) * 100
            # stock_message_user = sorted(stock_message_user, key=lambda x: x['success_rate'], reverse=True)
            return Response(list(stock_message_user), status=status.HTTP_200_OK)

        # 指定會員
        if name:
            user = get_object_or_404(User, username=name)
            user_messages = user.created_messages

            user_messages_stock= user_messages.values('stock__name', 'stock__code').annotate(
                total_messages=Count('stock'),
                successful_messages=Count(Case(When(check_status='1', then=Value(1)), output_field=IntegerField())),
                failed_messages=Count(Case(When(check_status='-1', then=Value(1)), output_field=IntegerField())),
                success_rate=ExpressionWrapper(
                    Cast(F('successful_messages') * 100.0 / F('total_messages'), IntegerField()),
                    output_field=IntegerField()
                )
            )

            top_successful_messages = user_messages_stock.order_by('-successful_messages', '-total_messages')[:5]
            top_failed_messages = user_messages_stock.order_by('-failed_messages', '-total_messages')[:5]
            top_success_rate = user_messages_stock.order_by('-success_rate', '-total_messages')[:5]

            response_data = {
                "top_successful_messages": list(top_successful_messages),
                "top_failed_messages": list(top_failed_messages),
                "top_success_rate": list(top_success_rate),
            }

            return Response(response_data, status=status.HTTP_200_OK)

        # 全站排行
        all_messages = MessageBoard.objects.all()

        all_message_user = all_messages.values(
                username=F('create_id__username'),
                user_img=F('create_id__profile__avatar_url')
            ).annotate(
                total_messages=Count('create_id'),
                successful_messages=Count(Case(When(check_status='1', then=Value(1)), output_field=IntegerField())),
                failed_messages=Count(Case(When(check_status='-1', then=Value(1)), output_field=IntegerField())),
                success_rate=ExpressionWrapper(
                    # 整數
                    Cast(F('successful_messages') * 100.0 / F('total_messages'), IntegerField()),
                    # 小數第二位
                    # Round(Cast(F('successful_messages') * 100.0 / F('total_messages'), FloatField()), 2),
                    output_field=IntegerField()
                ),
                likes_count=Count('likes')
            )

        top_success_rate = all_message_user.order_by('-success_rate', '-successful_messages')[:10]
        top_total_messages = all_message_user.order_by('-total_messages', '-success_rate')[:10]
        top_like = all_message_user.order_by('-likes_count', '-total_messages')[:10]

        response_data = {
            "top_success_rate": list(top_success_rate),
            "top_total_messages": list(top_total_messages),
            "top_like": list(top_like),
        }

        return Response(response_data, status=status.HTTP_200_OK)



# 股票 rank SQL
'''
SELECT
    create_id__username AS username,
    create_id__profile__avatar_url AS user_img,
    COUNT(create_id) AS total_messages,
    SUM(CASE WHEN check_status='1' THEN 1 ELSE 0 END) AS successful_messages,
    SUM(CASE WHEN check_status='-1' THEN 1 ELSE 0 END) AS failed_messages,
    SUM(CASE WHEN check_status='1' THEN 1 ELSE 0 END) / COUNT(create_id) AS success_rate
FROM stock_message
GROUP BY create_id__username, create_id__profile__avatar_url;
'''

# 會員 rank SQL
'''
SELECT
    s.name AS stock_name,
    COUNT(m.id) AS total_messages,
    SUM(CASE WHEN m.check_status = '1' THEN 1 ELSE 0 END) AS check_status_1_count,
    SUM(CASE WHEN m.check_status = '-1' THEN 1 ELSE 0 END) AS check_status_minus_1_count,
    SUM(CASE WHEN m.check_status = '1' THEN 1 ELSE 0 END) / COUNT(m.id) AS success_rate
FROM stock s
LEFT JOIN messageboard m ON s.id = m.stock_id
GROUP BY s.name;
'''
# 全站
'''
SELECT
    mb.create_id_id AS username,
    u.avatar_url AS user_img,
    COUNT(mb.create_id_id) AS total_messages,
    SUM(CASE WHEN mb.check_status = '1' THEN 1 ELSE 0 END) AS successful_messages,
    SUM(CASE WHEN mb.check_status = '-1' THEN 1 ELSE 0 END) AS failed_messages,
    CAST(SUM(CASE WHEN mb.check_status = '1' THEN 1 ELSE 0 END) * 100.0 / COUNT(mb.create_id_id) AS INTEGER) AS success_rate,
    COUNT(ml.user_id) AS likes_count
FROM
    message_board mb
LEFT JOIN
    message_boardlike ml ON mb.id = ml.message_board_id
LEFT JOIN
    user u ON mb.create_id_id = u.id
GROUP BY
    mb.create_id_id, u.avatar_url
'''