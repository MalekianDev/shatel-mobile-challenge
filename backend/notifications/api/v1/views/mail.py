from rest_framework.generics import ListCreateAPIView

from notifications.api.v1.serializers import MailBulkSerializer
from notifications.models import MailBulk


class MailBulkListCreateAPIView(ListCreateAPIView):
    queryset = MailBulk.objects.all()
    serializer_class = MailBulkSerializer
