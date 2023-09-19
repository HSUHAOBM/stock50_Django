from rest_framework import serializers
from rest_framework.settings import api_settings
from stock.models import Stock, StockStopDealDate, StockInfo

class StockSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stock
        fields = '__all__'
        # fields = ('',)

class StockInfoSerializer(serializers.ModelSerializer):
    stock_name = serializers.CharField(source='stock.name', read_only=True, required=False)

    class Meta:
        model = StockInfo
        fields = '__all__'
        # fields = ('',)

class StockStopDealDateSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockStopDealDate
        fields = '__all__'
        # fields = ('',)

