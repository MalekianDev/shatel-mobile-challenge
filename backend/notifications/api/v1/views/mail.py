from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from notifications.api.v1.serializers import MailBulkSerializer, MailTemplateSerializer
from notifications.models import MailBulk, MailTemplate
from notifications.tasks import send_bulk_email_task


class MailBulkListCreateAPIView(ListCreateAPIView):
    queryset = MailBulk.objects.all().select_related("template", "creator", "detail")
    serializer_class = MailBulkSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        send_bulk_email_task.delay(instance.id)


class MailBulkRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    queryset = MailBulk.objects.all().select_related("template", "creator", "detail")
    serializer_class = MailBulkSerializer


class MailTemplateListCreateAPIView(ListCreateAPIView):
    queryset = MailTemplate.objects.all().select_related("creator")
    serializer_class = MailTemplateSerializer


class MailTemplateRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    queryset = MailTemplate.objects.all().select_related("creator").prefetch_related("bulk_mails")
    serializer_class = MailTemplateSerializer
