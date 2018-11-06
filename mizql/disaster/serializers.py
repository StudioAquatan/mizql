from rest_framework import serializers
from .models import Location, Alarm, DemoLocation, DemoAlarm


class AlarmSerializer(serializers.ModelSerializer):
    """
    注意報・警報のシリアライザ
    """

    class Meta:
        model = Alarm
        fields = ('pk', 'code', 'name', 'created_at')


class LocationSerializer(serializers.ModelSerializer):
    """
    地域情報のシリアライザ
    """

    alarms = AlarmSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = Location
        fields = ('pk', 'name', 'alarms', 'updated_at')


class DemoAlarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoAlarm
        fields = ('pk', 'code', 'name', 'created_at')


class DemoLocationSerializer(serializers.ModelSerializer):
    alarms = DemoAlarmSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = DemoLocation
        fields = ('pk', 'name', 'alarms', 'updated_at')
