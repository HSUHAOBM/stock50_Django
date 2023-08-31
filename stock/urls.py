from django.urls import path
from . import views

app_name = 'stock'
urlpatterns = [
    path('stock_info/<int:num>', views.stock_info),
    path('getstock_stopdeal/', views.get_stock_stopdeal),
    path('get_stock50/', views.get_stock50_list),


    # 取得指定股票的資訊，stock_id是參數
    path('get_stock_info/<str:stock_id>/', views.get_stock_info),
    # 取得所有股票的資訊
    path('get_stock_info/', views.get_stock_info),
]