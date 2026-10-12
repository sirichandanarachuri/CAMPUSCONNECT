from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import UserProfile, UserRole
from apps.adminportal.serializers import (
    CompanyAdminSerializer,
    InterviewAdminSerializer,
    JobAdminSerializer,
    JobApplicationAdminSerializer,
    PlatformStatsSerializer,
    PlacementOfficerAdminSerializer,
    StudentAdminSerializer,
    UserAdminSerializer,
)
from apps.companies.models import CompanyProfile
from apps.jobs.models import Job, JobApplication
from apps.placements.models import PlacementOfficerProfile
from apps.students.models import Interview, StudentProfile


class IsAdminUser(IsAuthenticated):
    def has_permission(self, request, view):
        return bool(
            super().has_permission(request, view)
            and hasattr(request.user, "profile")
            and request.user.profile.role == UserRole.ADMIN
        )


class AdminUserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.select_related("profile").all()

    @action(detail=True, methods=["patch"], url_path="toggle-active")
    def toggle_active(self, request, *args, **kwargs):
        user = self.get_object()
        if user == request.user:
            return Response({"detail": "You cannot deactivate your own account."}, status=400)
        user.is_active = not user.is_active
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)


class AdminStudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return StudentProfile.objects.select_related("user").all()


class AdminCompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CompanyProfile.objects.all()


class AdminPlacementOfficerViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PlacementOfficerAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return PlacementOfficerProfile.objects.select_related("user").all()


class AdminJobViewSet(viewsets.ModelViewSet):
    serializer_class = JobAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Job.objects.select_related("company").all()


class AdminApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobApplicationAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return JobApplication.objects.select_related("student__user", "job__company").all()


class AdminInterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewAdminSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Interview.objects.select_related("student__user", "company", "job").all()


class AdminDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        stats = {
            "total_users": User.objects.count(),
            "total_students": StudentProfile.objects.count(),
            "total_companies": CompanyProfile.objects.count(),
            "total_placement_officers": PlacementOfficerProfile.objects.count(),
            "total_jobs": Job.objects.count(),
            "total_applications": JobApplication.objects.count(),
            "total_interviews": Interview.objects.count(),
        }
        serializer = PlatformStatsSerializer(stats)
        return Response(serializer.data)

