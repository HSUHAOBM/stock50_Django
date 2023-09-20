
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import MessageBoard
import threading

# 使用 threading.local() 创建一个存储当前用户的变量
current_user = threading.local()

@receiver(pre_save, sender=MessageBoard)
def set_create_write_id(sender, instance, **kwargs):
    # 从 current_user 获取当前请求的用户
    user = getattr(current_user, 'user', None)
    if user:
        if not instance.create_id:
            instance.create_id = user
        instance.write_id = user