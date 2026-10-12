from rest_framework import serializers

from apps.companies.models import CompanyNotification, CompanyProfile
from apps.jobs.models import Job, JobApplication
from apps.students.models import Interview, StudentProfile


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyProfile
        fields = [
            "id",
            "user",
            "company_name",
            "industry",
            "website",
            "company_email",
            "description",
            "location",
            "contact_person",
            "phone_number",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "is_active", "created_at", "updated_at"]


class CompanyNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyNotification
        fields = ["id", "company", "title", "message", "is_read", "created_at"]
        read_only_fields = ["id", "company", "created_at"]


class JobSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(read_only=True)

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
            "eligibility_criteria",
            "min_cgpa",
            "min_year",
            "max_year",
            "department",
            "application_deadline",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "company", "created_at", "updated_at"]


class JobApplicationCompanySerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    job = serializers.PrimaryKeyRelatedField(read_only=True)

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
        read_only_fields = ["id", "student", "job", "applied_at", "updated_at"]

    def get_student(self, obj):
        return {
            "id": obj.student.id,
            "full_name": obj.student.full_name,
            "department": obj.student.department,
            "year_of_study": obj.student.year_of_study,
            "cgpa": obj.student.cgpa,
            "email": obj.student.user.email,
        }


class InterviewCompanySerializer(serializers.ModelSerializer):
    student_detail = serializers.SerializerMethodField()
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
            "notes",
            "status",
            "created_at",
            "updated_at",
            "application",
            "mode",
            "student_detail",
        ]
        read_only_fields = ["id", "student", "job", "company", "created_at", "updated_at", "student_detail"]

    def get_student_detail(self, obj):
        return {"id": obj.student_id, "full_name": obj.student.full_name, "email": obj.student.user.email, "job_title": obj.job.title}

    def validate(self, attrs):
        if self.instance and "application" in attrs and attrs["application"] != self.instance.application:
            raise serializers.ValidationError({"application": "The applicant cannot be changed after scheduling."})
        return attrs

