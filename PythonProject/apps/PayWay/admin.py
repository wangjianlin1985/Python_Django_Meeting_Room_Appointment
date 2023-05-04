from django.contrib import admin
from apps.PayWay.models import PayWay

# Register your models here.

admin.site.register(PayWay,admin.ModelAdmin)