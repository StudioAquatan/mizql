from rest_framework import serializers
from .models import Location, Alarm, DemoLocation, DemoAlarm, DemoRainForecast


class AlarmSerializer(serializers.ModelSerializer):
    """
    注意報・警報のシリアライザ
    """
    type = serializers.IntegerField(read_only=True, source='alarm_type')

    class Meta:
        model = Alarm
        fields = ('pk', 'code', 'name', 'created_at', 'type')


class ListDemoRainSerializer(serializers.ListSerializer):

    def to_representation(self, instance):
        all_data = instance.order_by('-created_at').all()
        forecasts = all_data[:6]
        observations = all_data[6:12]
        return {
            'forecasts': [
                {'amount': f.amount, 'created_at': f.created_at} for f in forecasts
            ],
            'observations': [
                {'amount': o.amount, 'created_at': o.created_at} for o in observations
            ]
        }


class DemoRainSerializer(serializers.ModelSerializer):

    class Meta:
        model = DemoRainForecast
        fields = ('amount', 'is_observed', 'created_at')
        list_serializer_class = ListDemoRainSerializer


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
    rain = DemoRainSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = DemoLocation
        fields = ('pk', 'name', 'alarms', 'updated_at', 'rain')
