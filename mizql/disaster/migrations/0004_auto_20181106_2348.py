# Generated by Django 2.1.3 on 2018-11-06 14:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('disaster', '0003_demorainforecast'),
    ]

    operations = [
        migrations.AlterField(
            model_name='demorainforecast',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rain', to='disaster.DemoLocation'),
        ),
    ]