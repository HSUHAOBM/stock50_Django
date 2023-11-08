from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required

app_name = 'stock'
urlpatterns = [


    # 爬蟲 沒開盤的日期
    path('getstock_stopdeal/', views.get_stock_stopdeal),
    # 爬蟲 台灣50名單 + 0050
    path('get_stock50/', views.get_stock50_list),

    # 爬蟲 取得所有股票的資訊
    path('get_stock_info/', views.get_stock_info),
    # 爬蟲 取得指定股票的資訊，stock_id是參數
    path('get_stock_info/<str:stock_id>/', views.get_stock_info),


    # 頁面
    path('stock_info/<int:num>/', views.stock_info),


    path('checktest/', views.check_message),
]