from django.urls import path
from . import views

app_name = 'rank'
urlpatterns = [
    path('rank', views.rank),
    path('score_statistics/', views.RankView.as_view()),

]