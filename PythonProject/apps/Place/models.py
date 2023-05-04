from django.db import models
from apps.PlaceType.models import PlaceType
from tinymce.models import HTMLField


class Place(models.Model):
    placeId = models.AutoField(primary_key=True, verbose_name='会议室id')
    placeTypeObj = models.ForeignKey(PlaceType,  db_column='placeTypeObj', on_delete=models.PROTECT, verbose_name='会议室类型')
    placeName = models.CharField(max_length=20, default='', verbose_name='会议室名称')
    placePhoto = models.ImageField(upload_to='img', max_length='100', verbose_name='会议室照片')
    personNum = models.IntegerField(default=0,verbose_name='容纳人数')
    placeLocation = models.CharField(max_length=20, default='', verbose_name='会议室位置')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='会议室单价')
    placeDesc = HTMLField(max_length=8000, verbose_name='详细介绍')
    addTime = models.CharField(max_length=20, default='', verbose_name='发布时间')

    class Meta:
        db_table = 't_Place'
        verbose_name = '会议室信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        place = {
            'placeId': self.placeId,
            'placeTypeObj': self.placeTypeObj.placeTypeName,
            'placeTypeObjPri': self.placeTypeObj.placeTypeId,
            'placeName': self.placeName,
            'placePhoto': self.placePhoto.url,
            'personNum': self.personNum,
            'placeLocation': self.placeLocation,
            'price': self.price,
            'placeDesc': self.placeDesc,
            'addTime': self.addTime,
        }
        return place

