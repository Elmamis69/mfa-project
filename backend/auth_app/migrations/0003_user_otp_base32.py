# Generated by Django 4.1.5 on 2023-01-16 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auth_app', '0002_user_username_alter_user_email'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='otp_base32',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
