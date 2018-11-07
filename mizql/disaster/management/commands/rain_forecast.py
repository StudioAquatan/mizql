from datetime import datetime, timezone, timedelta
from django.core.management.base import BaseCommand
from disaster.models import DemoLocation, DemoRainForecast

JST = timezone(timedelta(hours=+9), 'JST')


class Command(BaseCommand):

    def handle(self, *args, **options):
        areas = [
            {'code': 260000, 'name': '京都府'}
        ]
        rain_forecasts = {
            '京都府': [
                0.5, 0.5, 0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 3.5, 7.5, 8.0, 8.5, 5.0, 7.0, 3.5, 4.5
            ]
        }
        date = datetime.strptime('2018/09/04 12:00:00', '%Y/%m/%d %H:%M:%S').astimezone(JST)
        for area in areas:
            forecast = rain_forecasts[area['name']]
            loc, _ = DemoLocation.objects.get_or_create(
                code=area['code'], name=area['name'], defaults={'updated_at': date}
            )
            for amount in forecast:
                DemoRainForecast.objects.get_or_create(amount=amount, created_at=date, is_observed=True, location=loc)
                date = date + timedelta(minutes=10)
