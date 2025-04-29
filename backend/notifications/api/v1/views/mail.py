from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from notifications.api.v1.serializers import MailBulkSerializer, MailTemplateSerializer
from notifications.models import MailBulk, MailTemplate


class MailBulkListCreateAPIView(ListCreateAPIView):
    queryset = MailBulk.objects.all().select_related("template", "creator", "detail")
    serializer_class = MailBulkSerializer


class MailBulkRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    queryset = MailBulk.objects.all().select_related("template", "creator", "detail")
    serializer_class = MailBulkSerializer


class MailTemplateListCreateAPIView(ListCreateAPIView):
    queryset = MailTemplate.objects.all().select_related("creator")
    serializer_class = MailTemplateSerializer


class MailTemplateRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    queryset = MailTemplate.objects.all().select_related("creator").prefetch_related("bulk_mails")
    serializer_class = MailTemplateSerializer
