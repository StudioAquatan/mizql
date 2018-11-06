from rest_framework import serializers
from .models import Location, Alarm, DemoLocation, DemoAlarm


class AlarmSerializer(serializers.ModelSerializer):
    """
    注意報・警報のシリアライザ
    """
    type = serializers.IntegerField(read_only=True, source='alarm_type')

    class Meta:
        model = Alarm
        fields = ('pk', 'code', 'name', 'created_at', 'type')


class LocationSerializer(serializers.ModelSerializer):
    """
    地域情報のシリアライザ
    """

    alarms = AlarmSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = Location
        fields = ('pk', 'name', 'alarms', 'updated_at')


class DemoAlarmSerializer(serializers.ModelSerializer):
    type = serializers.IntegerField(read_only=True, source='alarm_type')

    class Meta:
        model = DemoAlarm
        fields = ('pk', 'code', 'name', 'created_at', 'type')


class DemoLocationSerializer(serializers.ModelSerializer):
    alarms = DemoAlarmSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = DemoLocation
        fields = ('pk', 'name', 'alarms', 'updated_at')
