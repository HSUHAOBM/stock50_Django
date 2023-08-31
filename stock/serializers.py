from rest_framework import serializers
from rest_framework.settings import api_settings
from stock.models import Stock, StockStopDealDate

class StockSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stock
        fields = '__all__'
        # fields = ('',)


class StockStopDealDateSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockStopDealDate
        fields = '__all__'
        # fields = ('',)

