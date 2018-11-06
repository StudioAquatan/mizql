import random
from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument(
            '-n', '--number', type=int, default=10, help='number of friends'
        )

    def handle(self, *args, **options):
        num = options['number']
        general_users = list(User.objects.filter(is_superuser=False).all())
        admin_users = User.objects.filter(is_superuser=True).all()
        for admin in admin_users:
            admin.follows.clear()
            users = random.sample(general_users, num)
            for u in users:
                admin.follows.add(u)
