from django.contrib import admin
from apps.TimeInterval.models import TimeInterval

# Register your models here.

admin.site.register(TimeInterval,admin.ModelAdmin)