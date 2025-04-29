from django.core.management.base import BaseCommand

from accounts.models import User


class Command(BaseCommand):
    help = "Creates a default admin user if one does not exist."

    def handle(self, *args, **options):
        username = "admin"
        email = "admin@example.com"
        password = "admin123"

        if not User.objects.filter(pk=1).exists():
            User.objects.create_superuser(id=1, username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Default admin user "{username}" created.'))
        else:
            self.stdout.write(self.style.WARNING(f'Admin user "{username}" already exists.'))
