from rest_framework import serializers

from _core.serializers import CreatorBaseSerializer
from notifications.choices import MailBulkStatusChoices
from notifications.models import MailBulk


class MailBulkSerializer(CreatorBaseSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = MailBulk
        fields = "__all__"

    def create(self, validated_data):
        if validated_data.get("status") != MailBulkStatusChoices.pending:
            raise serializers.ValidationError(
                {"status": ["Cannot create a mail bulk with a status different from pending."]}
            )

        return super().create(validated_data)

    def update(self, instance: MailBulk, validated_data):
        if instance.status == MailBulkStatusChoices.completed:
            raise serializers.ValidationError({"mail_bulk": ["Cannot update a completed mail bulk."]})

        errors = {}  # Grouped "RESOLVABLE" errors to improve the user experience
        if validated_data.get("file"):
            errors.setdefault("file", ["Cannot update the file of a mail bulk."])

        new_status = validated_data.get("status")
        if (
            new_status not in (MailBulkStatusChoices.cancelled, MailBulkStatusChoices.paused)
        ) and instance.status != new_status:
            errors.setdefault("status", ["User can only set the status to cancelled or paused."])

        if errors:
            raise serializers.ValidationError(errors)

        return super().update(instance, validated_data)
