from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Project document mentioned: send emails to all registered users using a dynamic email template
    I override User model email field to make it unique & not blank
    """

    email = models.EmailField(unique=True)
