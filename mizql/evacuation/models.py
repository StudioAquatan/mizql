from django.db import models
from django.db.models.expressions import RawSQL


class NearbyShelterManager(models.Manager):

    def with_distance(self, lat: float, lon: float):
        """
        Shelterクエリセットに対してdistanceカラムを追加する
        :param lat:
        :param lon:
        :return:
        """
        raw_queryset = self.get_queryset()
        # 距離を計算するクエリ
        query = """
            6371 * acos(
                cos(radians(%s)) * cos(radians(lat)) * cos(radians(lon) - radians(%s))
                + sin(radians(%s)) * sin(radians(lat))
            ) 
        """
        # 計算したdistanceフィールドをannotate
        queryset = raw_queryset.annotate(distance=RawSQL(query, (lat, lon, lat)))
        return queryset

    def get_nearby_shelters_list(self, lat: float, lon: float, distance: int):
        """
        自身の緯度経度から範囲を指定して避難所の情報一覧を取得する
        :param lat: 自身の緯度
        :param lon: 自身の経度
        :param distance: 取得する半径（メートル）
        :return: queryset
        """
        queryset = self.with_distance(lat, lon)
        # キロメートルに変換
        distance = distance / 1000
        # distanceの内容でフィルタ
        return queryset.filter(distance__lte=distance)


class Shelter(models.Model):
    """
    避難所のモデル
    """

    name = models.CharField(verbose_name='名前', max_length=255)
    address = models.CharField(verbose_name='住所', max_length=255)
    lat = models.FloatField(verbose_name='緯度')
    lon = models.FloatField(verbose_name='経度')

    objects = NearbyShelterManager()

    class Meta:
        unique_together = ('lat', 'lon')
        ordering = ['name']
