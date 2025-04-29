from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from notifications.api.v1.serializers import MailBulkSerializer
from notifications.models import MailBulk


class MailBulkListCreateAPIView(ListCreateAPIView):
    queryset = MailBulk.objects.all()
    serializer_class = MailBulkSerializer


class MailBulkRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    queryset = MailBulk.objects.all()
    serializer_class = MailBulkSerializer
