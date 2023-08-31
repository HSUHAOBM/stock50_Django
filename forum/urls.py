from django.urls import path
from forum import views
from . import views


app_name = 'forum'
urlpatterns = [
    path('', views.main),
    path('about', views.about),
    path('forum', views.forum),
]