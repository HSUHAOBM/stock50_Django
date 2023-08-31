from django.db import models

# Create your models here.

class Stock(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    create_date = models.DateTimeField(auto_now_add=True)
    write_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        db_table = 'stock'

    def __str__(self):
        return f"{self.code} - {self.name}"

class StockInfo(models.Model):
    stock = models.ForeignKey(Stock, related_name='stock', on_delete=models.CASCADE)
    # 日期
    date = models.DateField()
    # 開盤價
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    # 收盤價
    close_price = models.DecimalField(max_digits=10, decimal_places=2)
    # 最高價
    high_price = models.DecimalField(max_digits=10, decimal_places=2)
    # 最低價
    low_price = models.DecimalField(max_digits=10, decimal_places=2)
    # 成交股數
    volume = models.PositiveIntegerField()
    # 成交金額
    turnover = models.DecimalField(max_digits=20, decimal_places=2)
    # 成交筆數
    transaction_count = models.PositiveIntegerField()
    # 漲跌價差
    price_diff = models.DecimalField(max_digits=10, decimal_places=2)
    # 備註
    remark = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'stock_info'
        unique_together = ('stock', 'date')

    def __str__(self):
        return f"{self.stock} - {self.date}"

class StockStopDealDate(models.Model):
    date = models.DateField(unique=True)
    reason = models.CharField(max_length=200)

    class Meta:
        db_table = 'stock_stop_deal_date'

    def __str__(self):
        return str(self.date)