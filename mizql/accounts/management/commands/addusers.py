import random, string, uuid
from django.db import IntegrityError
from django.core.management.base import BaseCommand
from accounts.models import User


def get_random_name(n):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))


class Command(BaseCommand):
    """
    デモのためのユーザ追加コマンド
    """

    def add_arguments(self, parser):
        parser.add_argument(
            '-n', '--number', dest='num', type=int, default=1000, help='Number of users to add'
        )
        parser.add_argument(
            '--name-length', dest='length', type=int, default=7, help='Username length'
        )

    def handle(self, *args, **options):
        n = options['num']
        l = options['length']
        email_domain = '@example.com'
        for i in range(n):
            password = str(uuid.uuid1())
            username = get_random_name(l)
            email = username + email_domain
            try:
                User.objects.create_user(
                    username=username, email=email, password=password
                )
            except IntegrityError:
                continue
            print('Created: "{}"'.format(username))
