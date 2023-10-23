from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
sdxzxc
# # 帳號註冊資料
# class Member(models.Model):
#     TYPE_CHOICES = [
#         ('F', 'Facebook'),
#         ('W', 'Web'),
#         ('G', 'Google'),
#         ('O', 'Other'),
#         ('S', 'System'),
#     ]
#     name = models.CharField(max_length=100)
#     password = models.CharField(max_length=128)
#     email =  models.CharField(max_length=100)
#     create_id = models.OneToOneField('self', null=True, on_delete=models.SET_NULL, related_name='created_member')
#     write_id = models.OneToOneField('self', null=True, on_delete=models.SET_NULL, related_name='written_member')
#     create_date = models.DateTimeField(auto_now_add=True)
#     write_date = models.DateTimeField(auto_now=True)
#     type = models.CharField(max_length=1, choices=TYPE_CHOICES, null=True, blank=True)
#     level = models.IntegerField(default=1)
#     last_login_date = models.DateTimeField(null=True, blank=True)
#     last_login_ip = models.CharField(max_length=15, null=True, blank=True)

#     class Meta:
#         db_table = 'member'

#     def __str__(self):
#         return f"{self.name} ({self.email})"


# 個人詳細資料
class Profile(models.Model):
    TYPE_CHOICES = [
        ('F', 'Facebook'),
        ('W', 'Web'),
        ('G', 'Google'),
        ('O', 'Other'),
        ('S', 'System'),
    ]
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profile'
    )
    birthday = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='O', null=True, blank=True)
    address = models.CharField(max_length=255, default="台灣", null=True, blank=True)
    interests = models.CharField(max_length=255, default="無", null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True, default="/static/img/peo.png")
    self_intro = models.TextField(default="大家好", null=True, blank=True)
    last_login_ip = models.CharField(max_length=15, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    write_date = models.DateTimeField(auto_now=True)
    type = models.CharField(max_length=1, choices=TYPE_CHOICES, default='W', null=True, blank=True)

    class Meta:
        db_table = 'member_profile'

    def __str__(self):
        return f"Profile of {self.user.username} ({self.user.email})"


