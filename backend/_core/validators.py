from django.core.exceptions import ValidationError


def validate_csv_file(value: str) -> None:
    # Also its good to check file content type
    if not value.name.endswith(".csv"):
        raise ValidationError("Only CSV files are allowed.")
