from rest_framework import serializers

from accounts.models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model handling basic CRUD operations (without authorization).

    Why without authorization? Just for keeping it simple in the v1 phase.
    """

    class Meta:
        model = User
        exclude = ("date_joined", "groups", "user_permissions", "last_login", "is_superuser", "is_staff")
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "is_active": {"read_only": True},
        }

    def create(self, validated_data):
        """
        Handling user registration process
        """

        raw_password = validated_data.pop("password", None)
        if not raw_password:
            raise serializers.ValidationError({"password": "This field is required."})

        user = User(**validated_data)
        user.set_password(raw_password)
        user.save()

        return user
