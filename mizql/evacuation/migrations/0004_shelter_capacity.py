# Generated by Django 2.1.3 on 2018-11-06 07:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evacuation', '0003_auto_20181106_1637'),
    ]

    operations = [
        migrations.AddField(
            model_name='shelter',
            name='capacity',
            field=models.IntegerField(null=True, verbose_name='収容可能人数'),
        ),
    ]
