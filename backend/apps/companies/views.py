from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
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
from apps.students.models import Interview, Notification, StudentProfile


def notify_student(student, title, message):
    Notification.objects.create(student=student, title=title, message=message)


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
        try:
            company = self.request.user.company_profile
        except CompanyProfile.DoesNotExist:
            raise ValidationError({
                "company_profile": "Complete your company profile before posting a job."
            })
        job = serializer.save(company=company)
        eligible_students = [student for student in StudentProfile.objects.all() if job.is_eligible_for(student)]
        Notification.objects.bulk_create([
            Notification(student=student, title="New job opportunity", message=f"{company.company_name} posted {job.title}.")
            for student in eligible_students
        ])


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
        if application.status != "APPLIED":
            return Response({"detail": "Only newly applied candidates can be shortlisted."}, status=status.HTTP_400_BAD_REQUEST)
        application.status = JobApplication.ApplicationStatus.SHORTLISTED
        application.save()
        notify_student(application.student, "Application shortlisted", f"You have been shortlisted for {application.job.title} at {application.job.company.company_name}.")
        return Response(self.get_serializer(application).data)

    @action(detail=True, methods=["patch"], url_path="reject")
    def reject(self, request, *args, **kwargs):
        application = self.get_object()
        if application.job.company.user != request.user:
            return Response({"detail": "You do not have permission to update this application."}, status=status.HTTP_403_FORBIDDEN)
        if application.status in [JobApplication.ApplicationStatus.SELECTED, JobApplication.ApplicationStatus.REJECTED]:
            return Response({"detail": "This application can no longer be rejected."}, status=status.HTTP_400_BAD_REQUEST)
        application.status = JobApplication.ApplicationStatus.REJECTED
        application.save()
        notify_student(application.student, "Application update", f"Your application for {application.job.title} was not selected.")
        return Response(self.get_serializer(application).data)

    @action(detail=True, methods=["patch"], url_path="select")
    def select(self, request, *args, **kwargs):
        application = self.get_object()
        if application.status != JobApplication.ApplicationStatus.INTERVIEW:
            return Response({"detail": "Only interviewed candidates can be selected."}, status=status.HTTP_400_BAD_REQUEST)
        application.status = JobApplication.ApplicationStatus.SELECTED
        application.save()
        notify_student(application.student, "Congratulations!", f"You have been selected for {application.job.title} at {application.job.company.company_name}.")
        return Response(self.get_serializer(application).data)


class CompanyInterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewCompanySerializer
    permission_classes = [IsCompanyUser]

    def get_queryset(self):
        return Interview.objects.filter(company__user=self.request.user)

    def perform_create(self, serializer):
        company = CompanyProfile.objects.get(user=self.request.user)
        application = serializer.validated_data.get("application")
        if not application or application.job.company_id != company.id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"application": "Choose an applicant for one of your jobs."})
        if application.status != JobApplication.ApplicationStatus.SHORTLISTED:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"application": "Only shortlisted applicants can be scheduled for interview."})
        application.status = JobApplication.ApplicationStatus.INTERVIEW
        application.save(update_fields=["status", "updated_at"])
        interview = serializer.save(company=company, student=application.student, job=application.job)
        notify_student(application.student, "Interview scheduled", f"An interview for {application.job.title} has been scheduled for {interview.scheduled_at:%d %b %Y, %I:%M %p}.")

    def perform_update(self, serializer):
        interview = serializer.save()
        if interview.status == Interview.InterviewStatus.CANCELLED and interview.application_id:
            interview.application.status = JobApplication.ApplicationStatus.SHORTLISTED
            interview.application.save(update_fields=["status", "updated_at"])
            notify_student(interview.student, "Interview cancelled", f"Your interview for {interview.job.title} was cancelled.")
        else:
            notify_student(interview.student, "Interview updated", f"Your interview for {interview.job.title} has been updated.")


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


