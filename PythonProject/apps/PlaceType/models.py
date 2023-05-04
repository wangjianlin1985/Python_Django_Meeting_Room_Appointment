from django.db import models


class PlaceType(models.Model):
    placeTypeId = models.AutoField(primary_key=True, verbose_name='会议室类型id')
    placeTypeName = models.CharField(max_length=20, default='', verbose_name='会议室类型名称')
    placeTypeDesc = models.CharField(max_length=800, default='', verbose_name='会议室类型说明')

    class Meta:
        db_table = 't_PlaceType'
        verbose_name = '会议室类型信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        placeType = {
            'placeTypeId': self.placeTypeId,
            'placeTypeName': self.placeTypeName,
            'placeTypeDesc': self.placeTypeDesc,
        }
        return placeType

