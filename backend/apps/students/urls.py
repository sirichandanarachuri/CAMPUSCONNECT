from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.students.views import (
    EducationViewSet,
    ResumeViewSet,
    SkillViewSet,
    StudentDashboardViewSet,
    StudentInterviewViewSet,
    StudentJobApplicationViewSet,
    StudentNotificationViewSet,
    StudentProfileViewSet,
)

router = DefaultRouter()
router.register(r"profile", StudentProfileViewSet, basename="student-profile")
router.register(r"education", EducationViewSet, basename="student-education")
router.register(r"skills", SkillViewSet, basename="student-skills")
router.register(r"resume", ResumeViewSet, basename="student-resume")
router.register(r"applications", StudentJobApplicationViewSet, basename="student-applications")
router.register(r"interviews", StudentInterviewViewSet, basename="student-interviews")
router.register(r"notifications", StudentNotificationViewSet, basename="student-notifications")
router.register(r"dashboard", StudentDashboardViewSet, basename="student-dashboard")

urlpatterns = [
    path("", include(router.urls)),
]

