from django.contrib.auth.models import User
from rest_framework import serializers

from apps.accounts.models import UserProfile
from apps.companies.models import CompanyProfile
from apps.jobs.models import Job, JobApplication
from apps.students.models import StudentProfile
from apps.placements.models import PlacementOfficerProfile


class UserAdminSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_active", "date_joined", "profile"]

    def get_profile(self, obj):
        profile = UserProfile.objects.filter(user=obj).first()
        if profile:
            return {"role": profile.role, "phone_number": profile.phone_number}
        return None


class StudentAdminSerializer(serializers.ModelSerializer):
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
            "is_active",
        ]

    def get_user(self, obj):
        return {"id": obj.user.id, "username": obj.user.username, "email": obj.user.email, "is_active": obj.user.is_active}


class CompanyAdminSerializer(serializers.ModelSerializer):
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


class PlacementOfficerAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementOfficerProfile
        fields = [
            "id",
            "user",
            "full_name",
            "department",
            "office_location",
            "phone_number",
        ]


class JobAdminSerializer(serializers.ModelSerializer):
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


class JobApplicationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "id",
            "student",
            "job",
            "status",
            "cover_letter",
            "applied_at",
            "updated_at",
        ]


class InterviewAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = "apps.students.models.Interview"
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


class PlatformStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_students = serializers.IntegerField()
    total_companies = serializers.IntegerField()
    total_placement_officers = serializers.IntegerField()
    total_jobs = serializers.IntegerField()
    total_applications = serializers.IntegerField()
    total_interviews = serializers.IntegerField()

