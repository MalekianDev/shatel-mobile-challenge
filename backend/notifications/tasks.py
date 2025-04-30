import time

import pandas as pd
from celery import shared_task
from django.template import Context, Template

from _core.utils import send_email
from notifications.choices import MailBulkStatusChoices
from notifications.models import MailBulk


@shared_task
def send_bulk_email_task(mail_bulk_id: int) -> None:
    mail_bulk = MailBulk.objects.filter(id=mail_bulk_id).first()
    if mail_bulk and mail_bulk.status not in (
        MailBulkStatusChoices.cancelled,
        MailBulkStatusChoices.completed,
    ):
        MailBulk.objects.filter(id=mail_bulk_id).update(status=MailBulkStatusChoices.in_progress)

        template = Template(mail_bulk.template.body)

        chunks = pd.read_csv(mail_bulk.file, chunksize=50)
        for chunk in chunks:
            for _, row in chunk.iterrows():
                send_email(
                    to=row["email"],
                    subject=mail_bulk.subject,
                    body=template.render(Context({"national_id": row["national_id"], "email": row["email"]})),
                )

            mail_bulk.refresh_from_db()

            got_paused = mail_bulk.status == MailBulkStatusChoices.paused
            if got_paused:
                while got_paused:
                    time.sleep(30)
                    mail_bulk.refresh_from_db()

            if mail_bulk.status == MailBulkStatusChoices.cancelled:
                return

        MailBulk.objects.filter(id=mail_bulk_id).update(status=MailBulkStatusChoices.completed)
