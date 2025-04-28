from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.api.v1 import views as v1_views

app_name = "accounts"

urlpatterns_api_v1 = [
    path("user/", v1_views.UserListCreateAPIView.as_view(), name="user_list_create"),
]

# In this project I decide to share JWT endpoints between versions.
# So I keep this endpoints out of the versioning structure.
jwt_urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
