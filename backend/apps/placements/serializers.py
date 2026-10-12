from django.contrib.auth.models import User
from rest_framework import serializers

from apps.accounts.models import UserProfile
from apps.companies.models import CompanyProfile
from apps.jobs.models import Job, JobApplication
from apps.placements.models import PlacementNotification, PlacementOfficerProfile
from apps.students.models import Education, Interview, Resume, Skill, StudentProfile


class PlacementOfficerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementOfficerProfile
        fields = [
            "id",
            "user",
            "full_name",
            "department",
            "office_location",
            "phone_number",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class PlacementNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementNotification
        fields = ["id", "target_user", "title", "message", "is_read", "created_at"]
        read_only_fields = ["id", "target_user", "created_at"]


class StudentSummarySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "user",
            "full_name",
            "department",
            "year_of_study",
            "graduation_year",
            "cgpa",
            "city",
            "bio",
            "is_active",
        ]

    def get_user(self, obj):
        return {
            "id": obj.user.id,
            "username": obj.user.username,
            "email": obj.user.email,
        }


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            "id",
            "student",
            "institution_name",
            "degree",
            "field_of_study",
            "start_date",
            "end_date",
            "grade",
            "description",
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "student", "name", "level"]


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["id", "student", "file", "file_name", "uploaded_at"]


class CompanySummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            "id",
            "company_name",
            "industry",
            "website",
            "company_email",
            "description",
            "location",
            "contact_person",
            "phone_number",
            "is_active",
        ]


class JobSummarySerializer(serializers.ModelSerializer):
    company = serializers.StringRelatedField()

    class Meta:
        model = Job
        fields = [
            "id",
            "company",
            "title",
            "description",
            "location",
            "salary",
            "job_type",
            "min_cgpa",
            "min_year",
            "max_year",
            "department",
            "is_active",
        ]


class JobApplicationSummarySerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField()
    job = serializers.StringRelatedField()

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "student",
            "job",
            "status",
            "cover_letter",
            "applied_at",
        ]


class InterviewSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            "id",
            "student",
            "job",
            "company",
            "interview_round",
            "scheduled_at",
            "location",
            "meeting_link",
            "status",
        ]


class PlacementStatsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_companies = serializers.IntegerField()
    total_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    shortlisted = serializers.IntegerField()
    selected = serializers.IntegerField()
    rejected = serializers.IntegerField()
    total_interviews = serializers.IntegerField()

