import time

import pandas as pd
from celery import shared_task
from django.template import Context, Template

from _core.utils import send_email, count_csv_rows
from notifications.choices import MailBulkStatusChoices
from notifications.models import MailBulk, MailBulkDetail


@shared_task
def send_bulk_email_task(mail_bulk_id: int) -> None:
    """
    Process bulk email sending task.

    Note: This task only handles pending mail bulks. For interrupted tasks that are
    stuck in "in_progress" status because of any interruption, a separate maintenance task should be implemented
    to handle mail bulks that have been in "in_progress" status for too long.

    Args:
        mail_bulk_id (int): ID of the MailBulk to process
    """
    mail_bulk = MailBulk.objects.filter(id=mail_bulk_id, status=MailBulkStatusChoices.pending).first()
    if mail_bulk:
        MailBulk.objects.filter(id=mail_bulk_id).update(status=MailBulkStatusChoices.in_progress)

        template = Template(mail_bulk.template.body)

        detail = MailBulkDetail.objects.create(
            parent=mail_bulk,
            total_count=count_csv_rows(mail_bulk.file.path),
        )

        chunks = pd.read_csv(mail_bulk.file, chunksize=50)
        for chunk in chunks:
            chunk_size = len(chunk)
            for _, row in chunk.iterrows():
                send_email(
                    to=row["email"],
                    subject=mail_bulk.subject,
                    body=template.render(Context({"national_id": row["national_id"], "email": row["email"]})),
                )

            detail.sent_count += chunk_size
            detail.save(update_fields=["sent_count", "updated_at"])

            mail_bulk.refresh_from_db()

            got_paused = mail_bulk.status == MailBulkStatusChoices.paused
            if got_paused:
                while got_paused:
                    time.sleep(30)
                    mail_bulk.refresh_from_db()
                    got_paused = mail_bulk.status == MailBulkStatusChoices.paused

            if mail_bulk.status == MailBulkStatusChoices.cancelled:
                return

        MailBulk.objects.filter(id=mail_bulk_id).update(status=MailBulkStatusChoices.completed)
