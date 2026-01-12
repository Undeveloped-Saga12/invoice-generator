from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):

    def validate_total(self,value):
        if value<=0:
            raise serializers.ValidationError("Total amount must be greater than zero.")
        return value
    
    class Meta:
        model = Invoice
        fields = "__all__"