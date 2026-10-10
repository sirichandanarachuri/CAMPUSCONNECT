from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import UserProfile, UserRole
from apps.students.models import StudentProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserRole.choices, required=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name", "role", "phone_number"]

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value

    def create(self, validated_data):
        role = validated_data.pop("role")
        phone_number = validated_data.pop("phone_number", "")
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data,
        )
        UserProfile.objects.create(user=user, role=role, phone_number=phone_number)
        # If the user registers as a STUDENT, create an empty StudentProfile so student dashboard can load immediately.
        if role == UserRole.STUDENT:
            StudentProfile.objects.create(user=user, full_name=f"{user.first_name} {user.last_name}".strip() or user.username)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        profile = UserProfile.objects.filter(user=user).first()
        token["role"] = profile.role if profile else "UNKNOWN"
        token["username"] = user.username
        return token

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError({"detail": "Username and password are required."})

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Invalid username or password."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is disabled."})

        data = super().validate({"username": username, "password": password})
        profile = UserProfile.objects.filter(user=user).first()
        data["role"] = profile.role if profile else None
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": data["role"],
        }
        return data


class UserCurrentSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_active", "role"]

    def get_role(self, obj):
        profile = UserProfile.objects.filter(user=obj).first()
        return profile.role if profile else None

