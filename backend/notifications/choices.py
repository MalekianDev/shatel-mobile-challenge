from django.db import models


class MailBulkStatusChoices(models.IntegerChoices):
    pending = 0, "Pending"
    cancelled = 1, "Cancelled"
    in_progress = 2, "In Progress"
    completed = 3, "Completed"
    paused = 4, "Paused"
