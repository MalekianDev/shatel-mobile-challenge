from django.urls import path

from notifications.api.v1 import views as v1_views

app_name = "notifications"

urlpatterns_api_v1 = [
    path("mail/bulk/", v1_views.MailBulkListCreateAPIView.as_view(), name="mail-bulk-list-create"),
]
