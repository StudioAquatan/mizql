# Generated by Django 2.1.3 on 2018-11-06 16:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_auto_20181107_0059'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='second_name',
            new_name='last_name',
        ),
    ]