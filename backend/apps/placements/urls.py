from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.placements.views import (
    PlacementApplicationViewSet,
    PlacementCompanyViewSet,
    PlacementInterviewViewSet,
    PlacementJobViewSet,
    PlacementNotificationViewSet,
    PlacementOfficerProfileViewSet,
    PlacementStatsViewSet,
    PlacementStudentViewSet,
)

router = DefaultRouter()
router.register(r"profile", PlacementOfficerProfileViewSet, basename="placement-profile")
router.register(r"students", PlacementStudentViewSet, basename="placement-students")
router.register(r"companies", PlacementCompanyViewSet, basename="placement-companies")
router.register(r"jobs", PlacementJobViewSet, basename="placement-jobs")
router.register(r"applications", PlacementApplicationViewSet, basename="placement-applications")
router.register(r"interviews", PlacementInterviewViewSet, basename="placement-interviews")
router.register(r"notifications", PlacementNotificationViewSet, basename="placement-notifications")
router.register(r"stats", PlacementStatsViewSet, basename="placement-stats")

urlpatterns = [
    path("", include(router.urls)),
]

