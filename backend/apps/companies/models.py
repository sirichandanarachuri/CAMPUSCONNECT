from django.contrib.auth.models import User
from django.db import models


class CompanyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="company_profile")
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255, blank=True, default="")
    website = models.URLField(blank=True, default="")
    company_email = models.EmailField(blank=True, default="")
    description = models.TextField(blank=True, default="")
    location = models.CharField(max_length=255, blank=True, default="")
    contact_person = models.CharField(max_length=255, blank=True, default="")
    phone_number = models.CharField(max_length=25, blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.company_name


class CompanyNotification(models.Model):
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.company.company_name} - {self.title}"
