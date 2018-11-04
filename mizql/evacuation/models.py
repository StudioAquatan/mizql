from django.db import models
from django.db.models.expressions import RawSQL


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

    @classmethod
    def get_nearby_shelters_list(cls, lat: float, lon: float, distance: int):
        """
        自身の緯度経度から範囲を指定して避難所の情報一覧を取得する
        :param lat: 自身の緯度
        :param lon: 自身の経度
        :param distance: 取得する半径（メートル）
        :return: queryset
        """
        # キロメートルに変換
        distance = distance / 1000
        # 距離を計算するクエリ
        query = """
            6371 * acos(
                cos(radians(%s)) * cos(radians(lat)) * cos(radians(lon) - radians(%s))
                + sin(radians(%s)) * sin(radians(lat))
            ) 
        """
        # 計算したdistanceフィールドをannotate
        queryset = cls.objects.annotate(distance=RawSQL(query, (lat, lon, lat)))
        # distanceの内容でフィルタ
        return queryset.filter(distance__lte=distance)
