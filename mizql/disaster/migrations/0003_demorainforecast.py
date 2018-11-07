# Generated by Django 2.1.3 on 2018-11-06 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('disaster', '0002_auto_20181105_2353'),
    ]

    operations = [
        migrations.CreateModel(
            name='DemoRainForecast',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.FloatField(verbose_name='降水量')),
                ('created_at', models.DateTimeField(verbose_name='取得日時')),
                ('is_observed', models.BooleanField(verbose_name='観測値かどうか')),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='demo_forecasts', to='disaster.Location')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]