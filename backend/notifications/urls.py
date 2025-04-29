from django.urls import path

from notifications.api.v1 import views as v1_views

app_name = "notifications"

urlpatterns_api_v1 = [
    path("mail/bulk/", v1_views.MailBulkListCreateAPIView.as_view(), name="mail-bulk-list-create"),
    path("mail/bulk/<int:pk>/", v1_views.MailBulkRetrieveUpdateAPIView.as_view(), name="mail-bulk-detail"),
    path("mail/template/", v1_views.MailTemplateListCreateAPIView.as_view(), name="mail-template-list-create"),
    path("mail/template/<int:pk>/", v1_views.MailTemplateRetrieveUpdateAPIView.as_view(), name="mail-template-detail"),
]
