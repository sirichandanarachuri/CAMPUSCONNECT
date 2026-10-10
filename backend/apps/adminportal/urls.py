from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.adminportal.views import (
    AdminApplicationViewSet,
    AdminCompanyViewSet,
    AdminDashboardViewSet,
    AdminInterviewViewSet,
    AdminJobViewSet,
    AdminPlacementOfficerViewSet,
    AdminStudentViewSet,
    AdminUserViewSet,
)

router = DefaultRouter()
router.register(r"users", AdminUserViewSet, basename="admin-users")
router.register(r"students", AdminStudentViewSet, basename="admin-students")
router.register(r"companies", AdminCompanyViewSet, basename="admin-companies")
router.register(r"placement-officers", AdminPlacementOfficerViewSet, basename="admin-placement-officers")
router.register(r"jobs", AdminJobViewSet, basename="admin-jobs")
router.register(r"applications", AdminApplicationViewSet, basename="admin-applications")
router.register(r"interviews", AdminInterviewViewSet, basename="admin-interviews")
router.register(r"dashboard", AdminDashboardViewSet, basename="admin-dashboard")

urlpatterns = [
    path("", include(router.urls)),
]

