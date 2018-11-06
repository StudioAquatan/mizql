from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.expressions import RawSQL
from django.utils import timezone


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

    def __str__(self):
        return self.name


class PersonalEvacuationHistory(models.Model):
    """
    個人の避難履歴を取る
    """
    user = models.ForeignKey(get_user_model(), verbose_name='ユーザ', on_delete=models.CASCADE,
                             related_name='evacuation_histories')
    shelter = models.ForeignKey(Shelter, verbose_name='避難所', on_delete=models.CASCADE,
                                related_name='personal_histories')
    created_at = models.DateTimeField(auto_now_add=True)
    is_evacuated = models.BooleanField(verbose_name='避難しているか')

    class Meta:
        ordering = ['-created_at']


class EvacuationHistoryManager(models.Manager):

    def create(self, shelter: Shelter):
        """
        10分前から現在までの避難人数を取得
        :param shelter:
        :return:
        """
        now = timezone.now()
        # 最新の履歴から人数を取得
        personal_histories = PersonalEvacuationHistory.objects.prefetch_related('shelter').filter(shelter=shelter)
        try:
            latest_history = EvacuationHistory.objects.first()
            latest_count = 0
            latest_date = latest_history.created_at
        except EvacuationHistory.DoesNotExist:
            latest_count = 0
            try:
                last_history = personal_histories.last()
                latest_date = last_history.created_at
            except PersonalEvacuationHistory.DoesNotExist:
                latest_date = now
        # 前回取得時意向の履歴一覧
        personal_histories = personal_histories.filter(created_at__range=[latest_date, now])
        # 避難した人数
        at_shelter_count = personal_histories.filter(is_evacuated=True).count()
        # 帰宅した人数
        at_home_count = personal_histories.filter(is_evacuated=False).count()
        # 現在避難所に居る人数
        current_count = latest_count + at_shelter_count - at_home_count
        hist = self.model(shelter=shelter, count=current_count, created_at=now)
        hist.save()
        return hist


class EvacuationHistory(models.Model):
    """
    避難人数の履歴を取る
    """
    shelter = models.ForeignKey(Shelter, verbose_name='避難所', related_name='histories', on_delete=models.CASCADE)
    count = models.IntegerField('避難している人数')
    created_at = models.DateTimeField('取得日')

    objects = EvacuationHistoryManager()

    class Meta:
        ordering = ['-created_at']
