from django.db import models


class PayWay(models.Model):
    payWayId = models.AutoField(primary_key=True, verbose_name='支付方式id')
    payWayName = models.CharField(max_length=20, default='', verbose_name='支付方式名称')

    class Meta:
        db_table = 't_PayWay'
        verbose_name = '支付方式信息'
        verbose_name_plural = verbose_name

    def getJsonObj(self):
        payWay = {
            'payWayId': self.payWayId,
            'payWayName': self.payWayName,
        }
        return payWay

