from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import UserRole
from apps.companies.models import CompanyNotification, CompanyProfile
from apps.companies.serializers import (
    CompanyNotificationSerializer,
    CompanyProfileSerializer,
    InterviewCompanySerializer,
    JobApplicationCompanySerializer,
    JobSerializer,
)
from apps.jobs.models import Job, JobApplication
from apps.students.models import Interview


class IsCompanyUser(IsAuthenticated):
    def has_permission(self, request, view):
        return bool(
            super().has_permission(request, view)
            and hasattr(request.user, "profile")
            and request.user.profile.role == UserRole.COMPANY
        )


class CompanyProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return CompanyProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CompanyJobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return Job.objects.filter(company__user=self.request.user)

    def perform_create(self, serializer):
        company = CompanyProfile.objects.get(user=self.request.user)
        serializer.save(company=company)


class CompanyApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobApplicationCompanySerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return JobApplication.objects.filter(job__company__user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="shortlist")
    def shortlist(self, request, *args, **kwargs):
        application = self.get_object()
        if application.job.company.user != request.user:
            return Response({"detail": "You do not have permission to update this application."}, status=status.HTTP_403_FORBIDDEN)
        application.status = "SHORTLISTED"
        application.save()
        return Response(self.get_serializer(application).data)

    @action(detail=True, methods=["patch"], url_path="reject")
    def reject(self, request, *args, **kwargs):
        application = self.get_object()
        if application.job.company.user != request.user:
            return Response({"detail": "You do not have permission to update this application."}, status=status.HTTP_403_FORBIDDEN)
        application.status = "REJECTED"
        application.save()
        return Response(self.get_serializer(application).data)


class CompanyInterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewCompanySerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return Interview.objects.filter(company__user=self.request.user)

    def perform_create(self, serializer):
        company = CompanyProfile.objects.get(user=self.request.user)
        serializer.save(company=company)


class CompanyNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CompanyNotificationSerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return CompanyNotification.objects.filter(company__user=self.request.user)

    @action(detail=True, methods=["patch"], url_path="mark-read")
    def mark_read(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(self.get_serializer(notification).data)


