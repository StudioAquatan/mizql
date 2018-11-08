from rest_framework import serializers
from .models import Location, Alarm, DemoLocation, DemoAlarm, DemoRainForecast, RainForecast


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


class ListRainSerializer(serializers.ListSerializer):

    def to_representation(self, instance):
        all_data = instance.order_by('-created_at').all()
        forecasts = all_data.filter(is_observed=False)[:6]
        observations = all_data.filter(is_observed=True)[:6]
        return {
            'forecasts': [
                {'amount': f.amount, 'created_at': f.created_at} for f in forecasts
            ],
            'observations': [
                {'amount': o.amount, 'created_at': o.created_at} for o in observations
            ]
        }


class RainSerializer(serializers.ModelSerializer):

    class Meta:
        model = RainForecast
        fields = ('amount', 'is_observed', 'created_at')
        list_serializer_class = ListRainSerializer


class LocationSerializer(serializers.ModelSerializer):
    """
    地域情報のシリアライザ
    """

    alarms = AlarmSerializer(read_only=True, allow_null=True, many=True)
    rain = RainSerializer(read_only=True, allow_null=True, many=True)

    class Meta:
        model = Location
        fields = ('pk', 'name', 'alarms', 'rain', 'updated_at')

    def to_representation(self, instance):
        data = super(LocationSerializer, self).to_representation(instance)
        alarms = [alarm['name'] for alarm in data['alarms']]
        danger_alarms = ['洪水警報', '大雨警報']
        score = len(list(set(alarms).intersection(set(danger_alarms))))
        observed_amount = sum([observed['amount'] for observed in data['rain']['observations']])
        score += observed_amount // 20
        forecast_amount = sum([forecast['amount'] for forecast in data['rain']['forecasts']])
        score += forecast_amount // 20
        data['level'] = score
        return data


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

    def to_representation(self, instance):
        data = super(DemoLocationSerializer, self).to_representation(instance)
        alarms = [alarm['name'] for alarm in data['alarms']]
        danger_alarms = ['洪水警報', '大雨警報']
        score = len(list(set(alarms).intersection(set(danger_alarms))))
        observed_amount = sum([observed['amount'] for observed in data['rain']['observations']])
        score += observed_amount // 20
        forecast_amount = sum([forecast['amount'] for forecast in data['rain']['forecasts']])
        score += forecast_amount // 20
        data['level'] = score
        return data


