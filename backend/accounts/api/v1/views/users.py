from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from accounts.api.v1.serializers import UserSerializer
from accounts.models import User


class UserListCreateAPIView(ListCreateAPIView):
    """
    List all users or create a new user.
    """

    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return (AllowAny(),)
        return (IsAuthenticated(),)
