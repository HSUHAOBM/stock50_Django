

if __name__ == "__main__":

    from datetime import datetime, timedelta
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

    def create_or_update_schedule(task_name, task_function, cron_schedule, hour, minute, repeats=-1):
        try:
            schedule_task = Schedule.objects.get(name=task_name)
            next_run_time = arrow.now().replace(hour=hour, minute=minute).format()
            schedule_task.next_run = next_run_time
            schedule_task.cron = cron_schedule
            schedule_task.repeats = repeats
            schedule_task.task = task_function
            schedule_task.save()
            print(f"Schedule '{task_name}' updated successfully.")
        except Schedule.DoesNotExist:
            next_run_time = arrow.now().replace(hour=hour, minute=minute).format()
            schedule(task_function, name=task_name, repeats=repeats,
                     next_run=next_run_time,
                     schedule_type=Schedule.CRON, cron=cron_schedule)
            print(f"Schedule '{task_name}' created successfully.")

    # 固定排程
    task_name_1 = "檢查台灣50名單"
    create_or_update_schedule(
        task_name_1, 'stock50.tasks.get_stock_name_list', '48 13 * * 1-5', 13, 48)

    task_name_2 = "檢查留言排程"
    create_or_update_schedule(
        task_name_2, 'stock50.tasks.check_message', '00 14 * * 1-5', 14, 0)

    task_name_3 = "股市資料爬取"
    create_or_update_schedule(
        task_name_3, 'stock50.tasks.get_stock_info', '50 13 * * 1-5', 13, 50)

    task_name_4 = "股市休息日期"
    create_or_update_schedule(
        task_name_4, 'stock50.tasks.get_stock_stopdeal', '45 13 * * 1-5', 13, 45)

    # 初始排程
    current_time = datetime.now()
    get_stock_code_time = current_time + timedelta(minutes=1)
    get_stock_data_info = current_time + timedelta(minutes=2)

    task_name_5 = "第一次,台灣50名稱爬取"
    create_or_update_schedule(
        task_name_5, 'stock50.tasks.get_stock_name_list', '45 13 * * 1-5', get_stock_code_time.hour, get_stock_code_time.minute, 1)

    task_name_6 = "第一次,休息日爬取"
    create_or_update_schedule(
        task_name_6, 'stock50.tasks.get_stock_stopdeal', '45 13 * * 1-5', get_stock_code_time.hour, get_stock_code_time.minute, 1)

    task_name_7 = "第一次,股市資料爬取"
    create_or_update_schedule(
        task_name_7, 'stock50.tasks.get_stock_info', '45 13 * * 1-5', get_stock_data_info.hour, get_stock_data_info.minute, 1)

    # 每分鐘
    existing_schedule = Schedule.objects.filter(name="schedule測試").first()
    if existing_schedule is None:
        schedule('stock50.tasks.test_py', name="schedule測試",
                 schedule_type=Schedule.CRON, cron='* * * * 1-5')
        print("Schedule schedule測試 created successfully.")

    # else:
    #     print("Schedule schedule測試 already exists.")

    # schedule('stock50.tasks.test_py', name="schedule測試",
    #          schedule_type=Schedule.CRON, cron='* * * * 1-5')
