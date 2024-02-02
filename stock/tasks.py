from datetime import datetime, date
import requests
import json


def my_scheduled_task():
    # Your task logic here
    print("Scheduled task executed")


if __name__ == "__main__":

    import sys
    import os
    import django
    from django.core.wsgi import get_wsgi_application

    parent_dir = os.path.abspath(os.path.dirname(os.getcwd()))

    sys.path.append(parent_dir)
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "stock50.settings")
    application = get_wsgi_application()

    django.setup()

    from stock.models import Stock, StockStopDealDate, StockInfo
    from forum.models import MessageBoard

    # 固定排程建立
    from django_q.tasks import schedule, async_task
    from django_q.models import Schedule

    # 使用 async 執行任務 用法
    # async_task('stock.tasks.my_scheduled_task')

    import arrow

    task_name_1 = "檢查台灣50名單"
    task_name_2 = "檢查留言排程"
    task_name_3 = "股市資料爬取"
    task_name_4 = "股市休息日期"

    # 任务1
    if not Schedule.objects.filter(name=task_name_1).exists():
        next_run_time = arrow.now().replace(hour=13, minute=50).format()
        schedule('stock50.tasks.get_stock50_list', name=task_name_1,
                 next_run=next_run_time, schedule_type=Schedule.CRON, cron='00 13 * * 1-5')

    # 任务2
    if not Schedule.objects.filter(name=task_name_2).exists():
        next_run_time = arrow.now().replace(hour=14, minute=0).format()
        schedule('stock50.tasks.check_message', name=task_name_2,
                 next_run=next_run_time, schedule_type=Schedule.CRON, cron='00 14 * * 1-5')

    # 任务3
    if not Schedule.objects.filter(name=task_name_3).exists():
        next_run_time = arrow.now().replace(hour=13, minute=50).format()
        schedule('stock50.tasks.get_stock_info', name=task_name_3,
                 next_run=next_run_time, schedule_type=Schedule.CRON, cron='0 0 1 1 *')

    # 任务4
    if not Schedule.objects.filter(name=task_name_4).exists():
        next_run_time = arrow.now().replace(hour=13, minute=50).format()
        schedule('stock50.tasks.get_stock_stopdeal', name=task_name_4,
                 next_run=next_run_time, schedule_type=Schedule.CRON, cron='50 13 * * 1-5')

    # 每分鐘
    schedule('stock50.tasks.test_py', name="schedule測試",
             schedule_type=Schedule.CRON, cron='* * * * 1-5')
