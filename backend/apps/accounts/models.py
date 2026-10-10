from django.contrib.auth.models import User
from django.db import models


class UserRole(models.TextChoices):
    STUDENT = "STUDENT", "Student"
    COMPANY = "COMPANY", "Company"
    PLACEMENT_OFFICER = "PLACEMENT_OFFICER", "Placement Officer"
    ADMIN = "ADMIN", "Admin"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=30, choices=UserRole.choices, default=UserRole.STUDENT)
    phone_number = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.username} ({self.role})"
