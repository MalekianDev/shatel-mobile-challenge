from django.db import models

from accounts.models import User


class TimestampedBaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CreatorBaseModel(models.Model):
    creator = models.ForeignKey(User, on_delete=models.PROTECT, related_name="%(app_label)s_%(class)s_creator")

    class Meta:
        abstract = True
