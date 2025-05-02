import pandas as pd
from rest_framework import serializers


class CSVMailFileHeaderValidator(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, file):
        try:
            df = pd.read_csv(file, nrows=0)
            actual_headers = df.columns.tolist()
        except Exception as e:
            raise serializers.ValidationError("Invalid CSV file.")

        expected_headers = {"email", "national_id"}
        if not set(actual_headers).issubset(expected_headers):
            raise serializers.ValidationError(f"CSV file headers must be {expected_headers}.")

        return file
