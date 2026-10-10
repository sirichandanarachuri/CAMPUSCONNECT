from django.contrib.auth.models import User
from django.db import models

# Placeholder for placement drives, interviews, and reports.


class PlacementOfficerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="placement_officer_profile")
    full_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, blank=True, default="")
    office_location = models.CharField(max_length=255, blank=True, default="")
    phone_number = models.CharField(max_length=25, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.full_name or self.user.username


class PlacementNotification(models.Model):
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="placement_notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.target_user.username} - {self.title}"
