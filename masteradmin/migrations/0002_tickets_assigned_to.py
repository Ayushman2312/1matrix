# Generated by Django 5.1.5 on 2025-02-21 06:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('customersupport', '0001_initial'),
        ('masteradmin', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tickets',
            name='assigned_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='customersupport.supportuser'),
        ),
    ]
