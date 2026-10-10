from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.companies.views import (
    CompanyApplicationViewSet,
    CompanyInterviewViewSet,
    CompanyJobViewSet,
    CompanyNotificationViewSet,
    CompanyProfileViewSet,
)

router = DefaultRouter()
router.register(r"profile", CompanyProfileViewSet, basename="company-profile")
router.register(r"jobs", CompanyJobViewSet, basename="company-jobs")
router.register(r"applications", CompanyApplicationViewSet, basename="company-applications")
router.register(r"interviews", CompanyInterviewViewSet, basename="company-interviews")
router.register(r"notifications", CompanyNotificationViewSet, basename="company-notifications")

urlpatterns = [
    path("", include(router.urls)),
]

