import random
from datetime import datetime, timedelta, timezone
from django.core.management.base import BaseCommand
from tqdm import tqdm
from accounts.models import User
from evacuation.models import Shelter, EvacuationHistory, PersonalEvacuationHistory

JST = timezone(timedelta(hours=+9), 'JST')

random.seed(0)


def reverse_random(num):
    return num if 0.5 > random.random() else num * -1


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument(
            '--date', type=str, default='2018/09/04 08:00:00', help='%Y/%m/%d %H:%M:%S'
        )

    def handle(self, *args, **options):
        EvacuationHistory.objects.all().delete()
        PersonalEvacuationHistory.objects.all().delete()
        all_shelters = list(Shelter.objects.all())
        all_users = list(User.objects.all())
        for shelter in tqdm(all_shelters, desc='Shelters'):
            date = datetime.strptime(options['date'], '%Y/%m/%d %H:%M:%S').astimezone(JST)
            limit = reverse_random(shelter.capacity // 10)
            capacity = limit + shelter.capacity
            offset = int(shelter.capacity * random.uniform(0.0, 0.2))
            current = offset
            EvacuationHistory(shelter=shelter, count=current, created_at=date).save()
            count = 0
            while count < 9:
                date = date + timedelta(minutes=10)
                if capacity - current > 0:
                    current += int(offset * random.uniform(0.0, 2.0))
                current += reverse_random(int(current * random.uniform(0.0, 0.01)))
                EvacuationHistory(shelter=shelter, count=current, created_at=date).save()
                count += 1
        for user in tqdm(all_users, 'Users'):
            date = datetime.strptime(options['date'], '%Y/%m/%d %H:%M:%S').astimezone(JST) + timedelta(minutes=10 * 10)
            is_evacuated = True if 0.8 > random.random() else False
            shelter = random.choice(all_shelters)
            PersonalEvacuationHistory.objects.create(
                user=user, is_evacuated=is_evacuated, shelter=shelter, created_at=date
            )
