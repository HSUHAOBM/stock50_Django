from django.urls import path
from rank import views
from . import views

app_name = 'rank'
urlpatterns = [
    path('rank', views.rank),
]