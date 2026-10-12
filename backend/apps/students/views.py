from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.accounts.models import UserRole
from apps.jobs.models import Job, JobApplication
from apps.students.models import Education, Interview, Notification, Resume, Skill, StudentProfile
from apps.students.serializers import (
    EducationSerializer,
    InterviewSerializer,
    JobApplicationSerializer,
    ResumeSerializer,
    SkillSerializer,
    StudentNotificationSerializer,
    StudentProfileSerializer,
)


class IsStudentUser(IsAuthenticated):
    def has_permission(self, request, view):
        return bool(
            super().has_permission(request, view)
            and hasattr(request.user, "profile")
            and request.user.profile.role == UserRole.STUDENT
        )


class StudentProfileViewSet(viewsets.ModelViewSet):
    serializer_class = StudentProfileSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return StudentProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return Education.objects.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        student = StudentProfile.objects.get(user=self.request.user)
        application = serializer.save(student=student)
        CompanyNotification = __import__("apps.companies.models", fromlist=["CompanyNotification"]).CompanyNotification
        CompanyNotification.objects.create(
            company=application.job.company,
            title="New application",
            message=f"{student.full_name} applied for {application.job.title}.",
        )


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return Skill.objects.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        student = StudentProfile.objects.get(user=self.request.user)
        serializer.save(student=student)


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return Resume.objects.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        student = StudentProfile.objects.get(user=self.request.user)
        serializer.save(student=student)


class StudentJobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return JobApplication.objects.filter(student__user=self.request.user)

    def perform_create(self, serializer):
        student = StudentProfile.objects.get(user=self.request.user)
        serializer.save(student=student)


class StudentInterviewViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InterviewSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return Interview.objects.filter(student__user=self.request.user)


class StudentNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = StudentNotificationSerializer
    permission_classes = [IsStudentUser]

    def get_queryset(self):
        return Notification.objects.filter(student__user=self.request.user)

    http_method_names = ["get", "head", "options", "patch"]

    @action(detail=True, methods=["patch"], url_path="mark-read")
    def mark_read(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="mark-all-read")
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"detail": "All notifications marked as read."})

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        return Response({"count": self.get_queryset().filter(is_read=False).count()})


class StudentDashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsStudentUser]

    @action(detail=False, methods=["get"], url_path="eligible-jobs")
    def eligible_jobs(self, request):
        student = StudentProfile.objects.filter(user=request.user).first()
        if not student:
            return Response({"detail": "Student profile not found."}, status=status.HTTP_404_NOT_FOUND)

        jobs = Job.objects.filter(is_active=True)
        eligible_jobs = [job for job in jobs if job.is_eligible_for(student)]
        data = []
        for job in eligible_jobs:
            data.append({
                "id": job.id,
                "company": job.company.company_name,
                "title": job.title,
                "description": job.description,
                "location": job.location,
                "salary": job.salary,
                "job_type": job.job_type,
                "min_cgpa": job.min_cgpa,
                "department": job.department,
                "application_deadline": job.application_deadline,
            })
        return Response(data)

    @action(detail=False, methods=["get"], url_path="applications")
    def my_applications(self, request):
        applications = JobApplication.objects.filter(student__user=request.user)
        serializer = JobApplicationSerializer(applications, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="interviews")
    def my_interviews(self, request):
        interviews = Interview.objects.filter(student__user=request.user)
        serializer = InterviewSerializer(interviews, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="notifications")
    def my_notifications(self, request):
        notifications = Notification.objects.filter(student__user=request.user)
        serializer = StudentNotificationSerializer(notifications, many=True, context={"request": request})
        return Response(serializer.data)

