from django.urls import path
from member import views
from . import views

app_name = 'forum'
urlpatterns = [
    path('member_forum', views.member_forum),
    path('member_profile', views.member_profile),
    path('member_rank', views.member_rank),
    path('member_private', views.member_private),
    path('member_register', views.member_register),
    path('member_sigin', views.member_sigin),

]