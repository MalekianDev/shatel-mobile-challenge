from rest_framework import serializers

from _core.serializers import CreatorBaseSerializer
from notifications.choices import MailBulkStatus
from notifications.models import MailBulk


class MailBulkSerializer(CreatorBaseSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = MailBulk
        fields = "__all__"

    def validate_status(self, value):
        ALLOWED_STATUSES = (MailBulkStatus.cancelled, MailBulkStatus.paused)

        if value not in ALLOWED_STATUSES:
            raise serializers.ValidationError("User can only set the status to cancelled or paused.")

        return value

    def update(self, instance: MailBulk, validated_data):
        if validated_data.get("file"):
            raise serializers.ValidationError("Cannot update the file of a mail bulk.")

        if instance.status == MailBulkStatus.completed:
            raise serializers.ValidationError("Cannot update a completed mail bulk.")

        return super().update(instance, validated_data)
