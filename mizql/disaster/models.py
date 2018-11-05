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
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def is_deleted(self):
        if self.deleted_at is None:
            return False
        return True


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
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def is_deleted(self):
        if self.deleted_at is None:
            return False
        return True
