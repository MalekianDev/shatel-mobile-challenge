from __future__ import annotations

from django.db import models

from _core.models import CreatorBaseModel, TimestampedBaseModel
from _core.validators import validate_csv_file
from notifications.choices import MailBulkStatusChoices


class MailTemplate(TimestampedBaseModel, CreatorBaseModel):
    name = models.CharField(max_length=255)
    body = models.TextField()

    # Reverse relations type hinting
    bulk_mails: models.QuerySet[MailBulk]

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.name


class MailBulk(TimestampedBaseModel, CreatorBaseModel):
    subject = models.CharField(max_length=255)
    status = models.IntegerField(choices=MailBulkStatusChoices.choices, default=MailBulkStatusChoices.pending)
    file = models.FileField(upload_to="bulk_mails", validators=[validate_csv_file])

    # Load fixtures for default template
    template = models.ForeignKey(MailTemplate, default=1, on_delete=models.PROTECT, related_name="bulk_mails")

    # Reverse relations type hinting
    detail: MailBulkDetail

    def __str__(self):
        return self.subject


class MailBulkDetail(TimestampedBaseModel):
    total_count = models.IntegerField(default=0)
    sent_count = models.IntegerField(default=0)
    duplicate_count = models.IntegerField(default=0)

    parent = models.OneToOneField(MailBulk, on_delete=models.PROTECT, related_name="detail")

    def __str__(self):
        return f"{self.total_count} total email - {self.sent_count} sent - {self.duplicate_count} duplicate emails"
