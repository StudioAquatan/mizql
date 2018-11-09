from datetime import datetime
from django.core.management.base import BaseCommand

from disaster.info import DisasterReport
from disaster.models import DemoAlarm, DemoLocation


class Command(BaseCommand):

    date_format = '%Y/%m/%d_%H:%M:%S%z'

    def add_arguments(self, parser):
        parser.add_argument(
            '--lat', type=float, default=35.0249596, help='Latitude'
        )
        parser.add_argument(
            '--lon', type=float, default=135.774979, help='longitude'
        )
        parser.add_argument(
            '-d', '--datetime', dest='datetime', type=str, help='Format is {}'.format(self.date_format)
        )
        parser.add_argument(
            '--days', type=int, default=7, help='Get information days'
        )
        parser.add_argument(
            '--demo', action='store_true', default=False, help='Whether demo or prod'
        )

    def handle(self, *args, **options):
        raw_date = options['datetime']
        days = options['days']
        is_demo = options['demo']
        lat = options['lat']
        lon = options['lon']
        reporter = DisasterReport(lat, lon)
        if raw_date is None:
            date = datetime.now()
        else:
            date = datetime.strptime(raw_date + '+0900', self.date_format)
        if is_demo:
            reporter.location_class = DemoLocation
            reporter.alarm_class = DemoAlarm
        loc = reporter.get_area_info(date, days)
        if loc is None:
            print("Failed to add data")
            exit(1)
        print("Area name:", loc.name)
        print("Alarms:")
        for alarm in loc.alarms.all():
            print('\t', alarm.name)
