# Generated by Django 4.2.16 on 2025-04-29 13:06

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

import _core.utils


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="MailBulk",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("subject", models.CharField(max_length=255)),
                (
                    "status",
                    models.IntegerField(
                        choices=[(0, "Pending"), (1, "Cancelled"), (2, "In Progress"), (3, "Completed"), (4, "Paused")],
                        default=0,
                    ),
                ),
                ("file", models.FileField(upload_to="bulk_mails", validators=[_core.validators.validate_csv_file])),
                (
                    "creator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="%(app_label)s_%(class)s_creator",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="MailTemplate",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=255)),
                ("body", models.TextField()),
                (
                    "creator",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="%(app_label)s_%(class)s_creator",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="MailBulkDetail",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("total_count", models.IntegerField(default=0)),
                ("sent_count", models.IntegerField(default=0)),
                ("duplicate_count", models.IntegerField(default=0)),
                (
                    "parent",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT, related_name="details", to="notifications.mailbulk"
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="mailbulk",
            name="template",
            field=models.ForeignKey(
                default=1,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="bulk_mails",
                to="notifications.mailtemplate",
            ),
        ),
    ]
