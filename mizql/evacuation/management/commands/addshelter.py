import csv
import codecs
import errno
import os
import pathlib
from django.core.management.base import BaseCommand

from evacuation.models import Shelter


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '--csv',
            type=str,
            default='shelters.csv',
            help='Specify CSV to insert'
        )

    def handle(self, *args, **options):
        base_dir = pathlib.Path(os.path.abspath(__file__)).parent
        given_csv = pathlib.Path(options['csv'])
        if given_csv.is_absolute():
            csv_file = given_csv
        else:
            csv_file = base_dir / given_csv
        if not csv_file.exists():
            raise FileNotFoundError(
                errno.ENOENT, os.strerror(errno.ENOENT), csv_file.as_posix()
            )
        with codecs.open(csv_file.as_posix(), 'r', encoding='utf-8') as fp:
            reader = csv.reader(fp)
            # Skip header
            next(reader)
            keys = ['name', 'address', 'lat', 'lon']
            for row in reader:
                data = dict(zip(keys, row))
                obj, created = Shelter.objects.update_or_create(
                    lat=data.pop('lat'), lon=data.pop('lon'), defaults=data
                )
                if created:
                    print("Created: ", data['name'])
