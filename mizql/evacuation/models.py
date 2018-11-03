from django.db import models


class Shelter(models.Model):
    """
    避難所のモデル
    """

    name = models.CharField(verbose_name='名前', max_length=255)
    address = models.CharField(verbose_name='住所', max_length=255)
    lat = models.FloatField(verbose_name='緯度')
    lon = models.FloatField(verbose_name='経度')

    class Meta:
        unique_together = ('lat', 'lon')
        ordering = ['name']
