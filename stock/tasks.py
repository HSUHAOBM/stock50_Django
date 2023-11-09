from datetime import datetime, date
import requests
import json

# 取得當年股市停止交易的行事曆
def get_stock_stopdeal():
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By

    options = Options()
    options.chrome_executable_path="chromedriver"
    options.add_argument("--headless")  # 不顯示瀏覽器
    options.add_argument("--disable-gpu")  # 禁GPU加速
    driver = webdriver.Chrome(options=options)

    driver.get('https://www.twse.com.tw/zh/trading/holiday.html')
    table = driver.find_element(By.CLASS_NAME, 'rwd-table')
    # 所有的<tr>
    rows = table.find_elements(By.TAG_NAME, 'tr')
    result_list = []
    for row in rows:
        # 每一行中的<td>
        cells = row.find_elements(By.TAG_NAME, 'td')
        cell_texts = [cell.text for cell in cells]
        result_list.append(cell_texts)

    def convert_date(date_string, current_year):
        date_parts = date_string.split(" ")[0].split("月")
        month = int(date_parts[0])
        day = int(date_parts[1].split("日")[0])
        return f"{current_year}/{month:02d}/{day:02d}"

    def extract_data(data_list):
        current_year = datetime.now().year
        extracted_data = []
        last_description = None

        for item in data_list:
            if item:
                date_text = item[0]
                description = item[1]

                if not description:
                    description = last_description

                if date_text:
                    formatted_date = convert_date(date_text, current_year)
                    extracted_data.append([formatted_date, description])
                    last_description = description
        return extracted_data

    formatted_data = extract_data(result_list)

    for item in formatted_data:
        date_string, reason = item
        date_obj = datetime.strptime(date_string, '%Y/%m/%d').date()

        if not StockStopDealDate.objects.filter(date=date_obj).exists():
            StockStopDealDate.objects.create(date=date_obj, reason=reason)

    response_data = {"ok": "True"}

# 取得台灣50名單
def get_stock50_list():

    url = 'https://www.yuantaetfs.com/api/Composition?fundid=1066'
    res = requests.get(url)
    stock50_data = json.loads(res.text)

    # 初始化名單
    Stock.objects.update(active=False)

    for stock_data in stock50_data:
        stock_code = stock_data["stkcd"]
        stock_name = stock_data["name"]
        stock_name_en = stock_data["ename"]

        stock, created = Stock.objects.get_or_create(
            code=stock_code,
            defaults={'name': stock_name, 'name_en': stock_name_en}
        )

        if not created:
            stock.name = stock_name
            stock.name_en = stock_name_en
        stock.active = True
        stock.save()

    stock_0050, _ = Stock.objects.get_or_create(
        code='0050',
        defaults={'name': '元大台灣50', 'name_en':'Yuanta/P-shares Taiwan Top 50 ETF'}
    )
    if not stock_0050.active:
        stock_0050.active = True
        stock_0050.save()

    active_stocks = Stock.objects.filter(active=True)
    inactive_stocks = Stock.objects.filter(active=False)

    active_stock_data = [{"code": stock.code, "name": stock.name} for stock in active_stocks]
    inactive_stock_data = [{"code": stock.code, "name": stock.name} for stock in inactive_stocks]

    response_data = {
        "active_stocks": active_stock_data,
        "inactive_stocks": inactive_stock_data,
    }


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

    # 初始資料
    get_stock_stopdeal()
    get_stock50_list()

    # 固定排程建立
    from django_q.tasks import schedule,async_task
    from django_q.models import Schedule

    # async_task('stock.tasks.my_scheduled_task')

    schedule('stock50.tasks.check_message', name="檢查留言排程", schedule_type=Schedule.CRON, cron = '00 14 * * 1-5')
    schedule('stock50.tasks.get_stock_info', name="股市資料爬取", schedule_type=Schedule.CRON, cron = '50 13 * * 1-5')

    # 每分鐘
    # schedule('stock50.tasks.test_py', schedule_type=Schedule.CRON, cron = '* * * * 1-5')
