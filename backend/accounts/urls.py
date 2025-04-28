from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# In this project I decide to share JWT endpoints between versions.
# So I keep this endpoints out of the versioning structure.
jwt_urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
