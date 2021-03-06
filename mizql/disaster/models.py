from django.db import models


class Location(models.Model):
    """
    地域の情報
    """
    code = models.IntegerField('地域コード', unique=True)
    name = models.CharField('地域名', max_length=100)
    updated_at = models.DateTimeField('更新日時')

    class Meta:
        ordering = ['-updated_at']


class Alarm(models.Model):
    """
    警報・注意報
    """
    code = models.IntegerField('区分コード')
    name = models.CharField('名称', max_length=100)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='alarms', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def alarm_type(self):
        t = 0
        if "注意報" in self.name:
            t = 1
        elif "警報" in self.name:
            t = 2
        return t


class DemoLocation(models.Model):
    """
    デモ用のLocation情報
    """
    code = models.IntegerField('地域コード', unique=True)
    name = models.CharField('地域名', max_length=100)
    updated_at = models.DateTimeField('更新日時')

    class Meta:
        ordering = ['-updated_at']


class DemoAlarm(models.Model):
    """
    デモ用の注意報・警報情報
    """
    code = models.IntegerField('区分コード')
    name = models.CharField('名称', max_length=100)
    location = models.ForeignKey(DemoLocation, on_delete=models.CASCADE, related_name='alarms', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def alarm_type(self):
        t = 0
        if "注意報" in self.name:
            t = 1
        elif "警報" in self.name:
            t = 2
        return t


class RainForecast(models.Model):
    """
    降水量情報
    """
    amount = models.FloatField('降水量')
    created_at = models.DateTimeField('取得日時')
    is_observed = models.BooleanField('観測値かどうか')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='rain')

    class Meta:
        ordering = ['-created_at']


class DemoRainForecast(models.Model):
    """
    デモ用の降水量情報
    """
    amount = models.FloatField('降水量')
    created_at = models.DateTimeField('取得日時')
    is_observed = models.BooleanField('観測値かどうか')
    location = models.ForeignKey(DemoLocation, on_delete=models.CASCADE, related_name='rain')

    class Meta:
        ordering = ['-created_at']
