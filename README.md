
# 股Day- 台灣50 Stock-Prediction
* 2023/11/29  使用 django 重構
<br>
<br>

## 「臺灣50指數成分股」為討論台灣50相關股票的社群


## 網站連結：https://haogooday.life/
### 測試帳號/密碼：test01@test.com /123456

<br>
<br>

## 前置作業 ##

1. git clone

2. docker-compose up



## Technologies

<ul>
    <li>Linode VPS ( Ubuntu )</li>
    <li>Frontend: HTML, CSS, JavaScript, RWD, AJAX</li>
    <li>Backend: Python Django</li>
    <li>Database: PostgreSQL</li>
    <li>Version Control: Git, GitHub</li>
    <li>Reverse Proxy: Nginx</li>
    <li>Web Crawler: Python Requests, BeautifulSoup, Selenium</li>
    <li>Docker</li>

</ul>



<br>

<hr/>

## 架構

### Client > Linode > Docker (Nginx > Django > PostgreSQL )
### 　　　　　　　　　　　　　　　




<br>
<hr/>

## 網站功能導覽

### 首頁
![首頁](https://user-images.githubusercontent.com/73993570/128681001-3cc753bb-4b10-4654-b641-02272da5f0d9.jpg)

<br>

### 預測功能：預測留言發布、討論
![01](https://user-images.githubusercontent.com/73993570/128708380-e3cb8a1a-1bd2-42ab-abd9-ea69277b2c3a.gif)

![預測審核](https://user-images.githubusercontent.com/73993570/128681528-5710a6c4-2482-4000-a24b-3bfa1a882dc4.jpg)

<br>

### 排行榜：根據預測成績排名
![排行榜](https://user-images.githubusercontent.com/73993570/128681551-959f334f-ae94-45db-97ad-6edcedb01987.jpg)

<br>

### 個股資訊：報價、新聞、預測、排名
![03](https://user-images.githubusercontent.com/73993570/128722830-a310c381-edb1-407f-87c0-f4f768571149.gif)

<br>

### 會員私訊：發送與讀取
![私人訊息](https://user-images.githubusercontent.com/73993570/128683441-6373a673-3a1b-4db7-be87-eb50d6851730.jpg)
![私訊讀取](https://user-images.githubusercontent.com/73993570/128683450-041552c1-2ec7-4a82-bb25-6c078fa8681b.jpg)

### 網站問題與建議回報![站內訊息站方](https://user-images.githubusercontent.com/73993570/128683630-96e92d7f-8a8f-4dcc-b65f-f2f0ea5d304d.jpg)
<hr>

<!-- ### 管理者模式：讀取網站問題與建議的私訊
![特殊權限](https://user-images.githubusercontent.com/73993570/128683815-7f690a43-8216-46c3-8a2d-2e3d2bca7072.jpg)
### 管理者模式：刪除預測留言
![特殊權限刪除](https://user-images.githubusercontent.com/73993570/128683832-48c3bb78-2bbd-4ff1-ae98-64de8c19f769.jpg) -->

----

## 待修正與優化
1. 第三方登入（ google )
2. 管理者界面
3. Redis 快取套用