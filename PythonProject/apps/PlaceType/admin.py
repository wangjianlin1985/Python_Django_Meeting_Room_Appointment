from django.contrib import admin
from apps.PlaceType.models import PlaceType

# Register your models here.

admin.site.register(PlaceType,admin.ModelAdmin)