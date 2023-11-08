from datetime import datetime, date

from forum.models import MessageBoard
from stock.models import Stock, StockInfo, StockStopDealDate

import requests
import json
import time
import random

# import logging
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', filename='my_log.log')

import logging
from logging.handlers import RotatingFileHandler

# 定義日誌格式
log_format = '%(asctime)s - %(levelname)s - %(message)s'

# 設定層級，使用相同的格式變數
logging.basicConfig(level=logging.INFO, format=log_format)

# 創建RotatingFileHandler，設定大小和備份數量
log_handler = RotatingFileHandler('my_log.log', maxBytes=1024 * 1024, backupCount=3)
log_handler.setLevel(logging.INFO)
log_handler.setFormatter(logging.Formatter(log_format))

# 添加處理程序
logging.root.addHandler(log_handler)


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
        logging.info(f"開始檢查用戶留言, {datetime.now().date()} , {reason}")
    try:
        # 檢核 check_status 為空的 留言
        check_messages = MessageBoard.objects.filter(check_status=None)
        for message in check_messages:
            stock_info = StockInfo.objects.filter(stock__code=message.stock.code).order_by('-date').first()

            if stock_info:
                if (stock_info.price_diff > 0 and message.stock_status == '1') or (stock_info.price_diff < 0 and message.stock_status == '-1') or (stock_info.price_diff == 0 and message.stock_status == '0'):
                    message.check_status = '1'
                else:
                    message.check_status = '0'
                message.save()
    except Exception as e:
        logging.error("留言檢查發生錯誤：%s" % ( str(e)))


# 取得股票當日最新收盤
def get_stock_info(stock_id=None):

    # 停止交易日 判斷
    today = date.today()
    try:
        stop_deal_date = StockStopDealDate.objects.get(date=today)
        reason = stop_deal_date.reason
        logging.info(f"今日 {datetime.now().date() }停止交易日,{reason}")
        response_data = {"ok": True}
    except StockStopDealDate.DoesNotExist:
        reason = "正常交易日"
        logging.info(f"開始取得股票當日最新收盤 {datetime.now().date()} , {reason}")

    get_ok = True
    if stock_id :
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
    existing_data = StockInfo.objects.filter(stock=stock_instance, date=datetime.now().date())
    if existing_data.exists():
        logging.error(f" {stock_instance.name} {stock_instance.code} 資料已存在")
        return False

    logging.info("%s - %s 資訊開始取得..." % (stock_instance.code, stock_instance.name))

    url = "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=" + datetime.now().strftime('%Y%m%d') + "&stockNo=" + str(stock_code)
    headers = {"user-agent":random.choice(user_agents)}
    res = requests.get(url, headers = headers)

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

                date_str = f"{year}/{date_str.split('/')[1]}/{date_str.split('/')[2]}"  # 轉換為西元年的完整日期字串
                date_today = datetime.strptime(date_str, '%Y/%m/%d').date()  # 將字串轉換為 datetime 物件

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
                    last_stock_info = StockInfo.objects.filter(stock=stock_instance).latest('date')
                    last_close_price = float(last_stock_info.close_price)  # 將 DecimalField 轉換為 float
                    price_diff = last_close_price - close_price
                    dividend_remark = "除息日,除息金額：%s" % (last_close_price - open_price)
                    logging.info(" %s 除息日處理" % (stock_instance.name) )
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
                logging.info("%s - %s 資訊取得成功儲存完畢" % (stock_instance.code, stock_instance.name))
                return True

            except Exception as e:
                logging.error("%s - %s 資訊取得錯誤：%s" % (stock_instance.code, stock_instance.name, str(e)))
                return False
    time.sleep(1/2)
