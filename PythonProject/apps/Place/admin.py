from django.contrib import admin
from apps.Place.models import Place

# Register your models here.

admin.site.register(Place,admin.ModelAdmin)