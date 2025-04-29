from rest_framework import serializers

from _core.serializers import CreatorBaseSerializer
from notifications.models import MailBulk


class MailBulkSerializer(CreatorBaseSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = MailBulk
        fields = "__all__"
