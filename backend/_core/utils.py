from rest_framework import serializers


def validate_csv_file(value: str) -> None:
    if not value.name.endswith(".csv"):
        raise serializers.ValidationError({"file": "Only CSV files are allowed."})
