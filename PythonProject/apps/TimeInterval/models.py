from django.db import models


class TimeInterval(models.Model):
    intervalId = models.AutoField(primary_key=True, verbose_name='时段id')
    intervalName = models.CharField(max_length=20, default='', verbose_name='时段名称')
    product = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='商品数量')

    class Meta:
        db_table = 't_TimeInterval'
        verbose_name = '时段信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        timeInterval = {
            'intervalId': self.intervalId,
            'intervalName': self.intervalName,
            'product': self.product,
        }
        return timeInterval

