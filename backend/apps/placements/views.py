from django.db.models import Count, Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import UserRole
from apps.companies.models import CompanyProfile
from apps.jobs.models import Job, JobApplication
from apps.placements.models import PlacementNotification, PlacementOfficerProfile
from apps.placements.serializers import (
    CompanySummarySerializer,
    EducationSerializer,
    InterviewSummarySerializer,
    JobApplicationSummarySerializer,
    JobSummarySerializer,
    PlacementNotificationSerializer,
    PlacementOfficerProfileSerializer,
    PlacementStatsSerializer,
    ResumeSerializer,
    SkillSerializer,
    StudentSummarySerializer,
)
from apps.students.models import Education, Interview, Resume, Skill, StudentProfile


class IsPlacementOfficer(IsAuthenticated):
    def has_permission(self, request, view):
        return bool(
            super().has_permission(request, view)
            and hasattr(request.user, "profile")
            and request.user.profile.role == UserRole.PLACEMENT_OFFICER
        )


class PlacementOfficerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PlacementOfficerProfileSerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return PlacementOfficerProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PlacementStudentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StudentSummarySerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return StudentProfile.objects.select_related("user").all()

    @action(detail=True, methods=["get"], url_path="education")
    def education(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = EducationSerializer(Education.objects.filter(student=student), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="skills")
    def skills(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = SkillSerializer(Skill.objects.filter(student=student), many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], url_path="resume")
    def resume(self, request, *args, **kwargs):
        student = self.get_object()
        serializer = ResumeSerializer(Resume.objects.filter(student=student), many=True)
        return Response(serializer.data)


class PlacementCompanyViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CompanySummarySerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return CompanyProfile.objects.all()


class PlacementJobViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobSummarySerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return Job.objects.select_related("company").all()


class PlacementApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobApplicationSummarySerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return JobApplication.objects.select_related("student__user", "job__company").all()


class PlacementInterviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InterviewSummarySerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return Interview.objects.select_related("student__user", "job", "company").all()


class PlacementStatsViewSet(viewsets.ViewSet):
    permission_classes = [IsPlacementOfficer]

    @action(detail=False, methods=["get"], url_path="summary")
    def summary(self, request):
        stats = {
            "total_students": StudentProfile.objects.count(),
            "total_companies": CompanyProfile.objects.count(),
            "total_jobs": Job.objects.count(),
            "total_applications": JobApplication.objects.count(),
            "shortlisted": JobApplication.objects.filter(status="SHORTLISTED").count(),
            "selected": JobApplication.objects.filter(status="SELECTED").count(),
            "rejected": JobApplication.objects.filter(status="REJECTED").count(),
        }
        serializer = PlacementStatsSerializer(stats)
        return Response(serializer.data)


class PlacementNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = PlacementNotificationSerializer
    permission_classes = [IsPlacementOfficer]

    def get_queryset(self):
        return PlacementNotification.objects.filter(target_user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(target_user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="mark-read")
    def mark_read(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

