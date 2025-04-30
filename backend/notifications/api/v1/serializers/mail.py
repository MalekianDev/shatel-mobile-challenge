from rest_framework import serializers

from _core.serializers import CreatorBaseSerializer
from notifications.choices import MailBulkStatusChoices
from notifications.models import MailBulk, MailTemplate


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
            new_status
            not in (MailBulkStatusChoices.cancelled, MailBulkStatusChoices.paused, MailBulkStatusChoices.in_progress)
        ) and instance.status != new_status:
            errors.setdefault("status", ["User can only set the status to in progress, cancelled or paused."])

        if errors:
            raise serializers.ValidationError(errors)

        return super().update(instance, validated_data)


class MailTemplateSerializer(CreatorBaseSerializer):
    class Meta:
        model = MailTemplate
        fields = "__all__"

    def update(self, instance: MailTemplate, validated_data):
        if instance.bulk_mails.filter(
            status__in=(MailBulkStatusChoices.pending, MailBulkStatusChoices.paused, MailBulkStatusChoices.in_progress)
        ).exists():
            raise serializers.ValidationError(
                {"mail_template": ["Cannot update a mail template with pending, paused or in progress mail bulks."]}
            )

        return super().update(instance, validated_data)
