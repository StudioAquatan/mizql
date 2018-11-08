import requests
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from typing import Optional, List

from .models import Location, Alarm, RainForecast


class DisasterReport(object):
    base_url = 'http://api.aitc.jp/jmardb-api/'
    area_path = 'area'
    search_path = 'search'
    datetime_format = '%Y-%m-%d %H:%M:%S%z'
    datetime_parse_format = '%Y-%m-%dT%H:%M:%S.%f%z'
    demo_coordinates = (135.780418, 35.048900)
    location_class = Location
    alarm_class = Alarm

    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon

    def get_area(self) -> Optional[dict]:
        payload = {
            'latitude': self.lat,
            'longitude': self.lon,
        }
        res = requests.get(self.base_url + self.area_path, params=payload)
        if res.status_code != 200:
            return None
        data = res.json()['data']
        if len(data) == 0:
            return None
        # 地域の最も大きい区分（都道府県）のエリア情報を返却
        return data[0]['forecast'][-1]

    def _get_abstract(self, areacode: int, info_type: str, since_day: datetime=None, days: int=7) -> Optional[dict]:
        if since_day is None:
            since_day = datetime.now()
        payload = {
            'datetime': [
                since_day.strftime(self.datetime_format),
                (since_day - timedelta(days=days)).strftime(self.datetime_format),
            ],
            'areacode': areacode,
            'order': 'new',
            'title': info_type
        }
        res = requests.get(self.base_url + self.search_path, params=payload)
        if res.status_code != 200:
            return None
        data = res.json()['data']
        if len(data) == 0:
            return {'count': 0}
        return {
            'count': len(data),
            'link': data[0]['link'],
            'text': data[0]['headline'],
            'datetime': datetime.strptime(data[0]['datetime'], self.datetime_parse_format)
        }

    def _get_alarm_detail(self, url: str) -> Optional[List[dict]]:
        suffix = '.json?path=/report/body/warning/0'
        res = requests.get(url + suffix)
        if res.status_code != 200:
            return None
        data = res.json()['item'][0]
        alarms = list()
        for kind in data['kind']:
            alarms.append({
                'code': int(kind['code']),
                'name': kind['name'],
                'status': kind['status'],
            })
        return alarms

    def update_alarm(self, loc_id: int, code: int, name: str, status: str):
        if status == '解除':
            # 解除だったら削除する
            try:
                exists_alarm = self.alarm_class.objects.get(code=code, name=name, location_id=loc_id)
                exists_alarm.delete()
            except self.alarm_class.DoesNotExist:
                pass
            return None
        alarm, _ = self.alarm_class.objects.get_or_create(
            code=code, name=name, location_id=loc_id
        )
        return alarm

    def get_area_info(self, since_day: datetime=None, days: int=7) -> Optional[Location]:
        area = self.get_area()
        if area is None:
            return None
        loc, created = self.location_class.objects.update_or_create(**area, defaults={'updated_at': timezone.now()})
        # もし既存情報があったら全て削除
        loc.alarms.all().delete()
        # 警報の情報を取得
        alarm_kinds = ['気象特別警報・警報・注意報', '指定河川洪水予報', '土砂災害警戒情報', '記録的短時間大雨情報']
        for alarm_kind in alarm_kinds:
            alarm = self._get_abstract(loc.code, alarm_kind, since_day, days)
            if alarm['count'] == 0:
                continue
            details = self._get_alarm_detail(alarm['link'])
            if details is None:
                continue
            for detail in details:
                self.update_alarm(loc.pk, **detail)
        return loc


class RainReporter(object):
    API_KEY = settings.YOLP_APP_ID
    base_url = 'https://map.yahooapis.jp/weather/V1/place'
    forecast_key = 'forecast'
    datetime_format = '%Y%m%d%H%M%z'

    def __init__(self, lat: str, lon: str):
        self.lat = lat
        self.lon = lon

    def _make(self, w):
        created_at = datetime.strptime(str(w['Date']) + '+0900', self.datetime_format)
        amount = w['Rainfall'] if 'Rainfall' in w.keys() else 0.0
        return {
            'created_at': created_at,
            'amount': amount,
        }

    def _is_observed(self, w):
        if w['Type'] == self.forecast_key:
            return False
        return True

    def get_report(self, location):
        payload = {
            'coordinates': self.lon + ',' + self.lat,
            'appid': self.API_KEY,
            'past': 1,
            'output': 'json'
        }
        res = requests.get(self.base_url, params=payload)
        if res.status_code != 200:
            return None
        weathers = res.json()['Feature'][0]['Property']['WeatherList']['Weather']
        for w in weathers:
            info = self._make(w)
            r, _ = RainForecast.objects.update_or_create(
                created_at=info['created_at'], location=location,
                defaults={'amount': info['amount'], 'is_observed': self._is_observed(w)}
            )
