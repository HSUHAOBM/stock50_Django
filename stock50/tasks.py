from datetime import datetime, date

from forum.models import MessageBoard
from stock.models import Stock, StockInfo, StockStopDealDate

import requests
import json
import time
import random
import logging

logger = logging.getLogger('排程')


# 檢查留言
def check_message():
    # 停止交易日 判斷
    today = date.today()
    try:
        stop_deal_date = StockStopDealDate.objects.get(date=today)
        reason = stop_deal_date.reason

        return False

    except StockStopDealDate.DoesNotExist:
        reason = "正常交易日"
        logger.info(f"開始檢查用戶留言, {datetime.now().date()} , {reason}")
    try:
        # 檢核 check_status 為空的 留言
        check_messages = MessageBoard.objects.filter(check_status=None)
        for message in check_messages:
            stock_info = StockInfo.objects.filter(
                stock__code=message.stock.code).order_by('-date').first()

            if stock_info:
                if (stock_info.price_diff > 0 and message.stock_status == '1') or (stock_info.price_diff < 0 and message.stock_status == '-1') or (stock_info.price_diff == 0 and message.stock_status == '0'):
                    message.check_status = '1'
                else:
                    message.check_status = '0'
                message.save()
    except Exception as e:
        logger.error("留言檢查發生錯誤：%s" % (str(e)))


# 取得股票當日最新收盤
def get_stock_info(stock_id=None):
    # 停止交易日 判斷
    today = date.today()
    try:
        stop_deal_date = StockStopDealDate.objects.get(date=today)
        reason = stop_deal_date.reason
        logger.info(f"今日 {datetime.now().date() }停止交易日,{reason}")
        print(f"今日 {datetime.now().date() }停止交易日,{reason}")
        response_data = {"ok": True}
        return response_data

    except StockStopDealDate.DoesNotExist:
        reason = "正常交易日"
        logger.info(f"開始取得股票當日最新收盤 {datetime.now().date()} , {reason}")
        print(f"開始取得股票當日最新收盤 {datetime.now().date()} , {reason}")

    get_ok = True
    if stock_id:
        get_ok = get_stock_info_data(stock_id)
    else:
        stock_list = Stock.objects.all()
        for stock in stock_list:
            if not get_stock_info_data(stock.code):
                get_ok = False
                continue


user_agents = [
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; AcooBrowser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)",
    "Mozilla/4.0 (compatible; MSIE 7.0; AOL 9.5; AOLBuild 4337.35; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)",
    "Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0)",
    "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 1.0.3705; .NET CLR 1.1.4322)",
    "Mozilla/4.0 (compatible; MSIE 7.0b; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; InfoPath.2; .NET CLR 3.0.04506.30)",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.3 (Change: 287 c9dfb30)",
    "Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.2pre) Gecko/20070215 K-Ninja/2.1.1",
    "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9) Gecko/20080705 Firefox/3.0 Kapiko/3.0",
    "Mozilla/5.0 (X11; Linux i686; U;) Gecko/20070322 Kazehakase/0.4.5",
    "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20",
    "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52",
    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"]


# 功能_爬台灣證券網，延遲1s設定
def get_stock_info_data(stock_code):

    stock_instance = Stock.objects.get(code=stock_code)
    # 檢查是否重複
    existing_data = StockInfo.objects.filter(
        stock=stock_instance, date=datetime.now().date())
    if existing_data.exists():
        logger.error(f" {stock_instance.name} {stock_instance.code} 資料已存在")
        return False

    logger.info("%s - %s 資訊開始取得..." %
                (stock_instance.code, stock_instance.name))

    url = "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=" + \
        datetime.now().strftime('%Y%m%d') + "&stockNo=" + str(stock_code)
    headers = {"user-agent": random.choice(user_agents)}
    res = requests.get(url, headers=headers)

    stock_data = json.loads(res.text)

    if "data" in stock_data:

        data = [stock_data["data"][-1]]
        for entry in data:
            try:
                # 日期判斷是否為今日
                date_str = entry[0]
                # 將民國年轉換為西元年
                roc_year = int(date_str.split('/')[0])
                year = roc_year + 1911  # 轉換為西元年

                # 轉換為西元年的完整日期字串
                date_str = f"{year}/{date_str.split('/')[1]}/{date_str.split('/')[2]}"
                date_today = datetime.strptime(
                    date_str, '%Y/%m/%d').date()  # 將字串轉換為 datetime 物件

                if date_today != datetime.now().date():  # 比較日期
                    break

                volume = int(entry[1].replace(",", ""))  # 成交股數
                turnover = float(entry[2].replace(",", ""))  # 成交金額
                open_price = float(entry[3].replace(",", ""))  # 開盤價
                high_price = float(entry[4].replace(",", ""))  # 最高價
                low_price = float(entry[5].replace(",", ""))  # 最低價
                close_price = float(entry[6].replace(",", ""))  # 收盤價
                transaction_count = int(entry[8].replace(",", ""))  # 成交筆數

                price_diff = entry[7].replace(",", "")  # 漲跌價差

                if price_diff == "X0.00":
                    last_stock_info = StockInfo.objects.filter(
                        stock=stock_instance).latest('date')
                    # 將 DecimalField 轉換為 float
                    last_close_price = float(last_stock_info.close_price)
                    price_diff = last_close_price - close_price
                    dividend_remark = "除息日,除息金額：%s" % (
                        last_close_price - open_price)
                    logger.info(" %s 除息日處理" % (stock_instance.name))
                else:
                    price_diff = float(entry[7])
                    dividend_remark = None

                stock_info = StockInfo.objects.create(
                    stock=stock_instance,
                    date=date_today,
                    volume=volume,
                    turnover=turnover,
                    open_price=open_price,
                    high_price=high_price,
                    low_price=low_price,
                    close_price=close_price,
                    price_diff=price_diff,
                    transaction_count=transaction_count,
                    remark=dividend_remark
                )
                logger.info("%s - %s 資訊取得成功儲存完畢" %
                            (stock_instance.code, stock_instance.name))
                return True

            except Exception as e:
                logger.error("%s - %s 資訊取得錯誤：%s" %
                             (stock_instance.code, stock_instance.name, str(e)))
                return False
    time.sleep(1/2)


def test_py():
    try:
        print('=====================')
        print(datetime.now())
        print('=====================')
    except Exception as e:
        print(f'Error in test_py: {e}')


# 取得當年股市停止交易的行事曆
def get_stock_stopdeal():
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By

    from selenium.webdriver.chrome.service import Service
    from webdriver_manager.chrome import ChromeDriverManager

    # service = Service()
    service = Service(executable_path=ChromeDriverManager().install())

    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # 不顯示瀏覽器
    options.add_argument("--disable-gpu")  # 禁GPU加速
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-infobars")
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(service=service, options=options)

    print("Chrome version:", driver.capabilities['browserVersion'])
    print("ChromeDriver version:",
          driver.capabilities['chrome']['chromedriverVersion'])

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

                if "開始交易" in description or "最後交易" in description:
                    continue

                if not description:
                    description = last_description

                if date_text:
                    formatted_date = convert_date(date_text, current_year)
                    extracted_data.append([formatted_date, description])
                    last_description = description
        return extracted_data

    formatted_data = extract_data(result_list)
    driver.quit()

    for item in formatted_data:
        date_string, reason = item
        date_obj = datetime.strptime(date_string, '%Y/%m/%d').date()

        if not StockStopDealDate.objects.filter(date=date_obj).exists():
            StockStopDealDate.objects.create(date=date_obj, reason=reason)
    print("停止交易日數據新增完成")
    logger.info("停止交易日數據新增完成")

# 取得台灣50名單


def get_stock_name_list():
    print('開始取得台灣50名單')
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
        defaults={'name': '元大台灣50',
                  'name_en': 'Yuanta/P-shares Taiwan Top 50 ETF'}
    )
    if not stock_0050.active:
        stock_0050.active = True
        stock_0050.save()

    active_stocks = Stock.objects.filter(active=True)
    inactive_stocks = Stock.objects.filter(active=False)

    active_stock_data = [{"code": stock.code, "name": stock.name}
                         for stock in active_stocks]
    inactive_stock_data = [{"code": stock.code, "name": stock.name}
                           for stock in inactive_stocks]

    # response_data = {
    #     "active_stocks": active_stock_data,
    #     "inactive_stocks": inactive_stock_data,
    # }
    print("台灣50名單 數據新增完成")
