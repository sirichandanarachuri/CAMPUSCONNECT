from django.contrib.auth.models import User
from rest_framework import serializers

from apps.accounts.models import UserProfile, UserRole
from apps.jobs.models import Job, JobApplication
from apps.students.models import Education, Notification, Resume, Skill, StudentProfile, Interview


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["role", "phone_number"]


class StudentProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    profile = serializers.SerializerMethodField()

    def get_profile(self, obj):
        return UserProfileSerializer(obj.user.profile).data if hasattr(obj.user, "profile") else None

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "user",
            "profile",
            "full_name",
            "department",
            "year_of_study",
            "graduation_year",
            "cgpa",
            "bio",
            "city",
            "address",
            "portfolio_url",
            "linkedin_url",
            "github_url",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


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
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "student", "created_at", "updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "student", "name", "level", "created_at", "updated_at"]
        read_only_fields = ["id", "student", "created_at", "updated_at"]


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ["id", "student", "file", "file_name", "uploaded_at"]
        read_only_fields = ["id", "student", "file_name", "uploaded_at"]


class StudentNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "student", "title", "message", "is_read", "created_at"]
        read_only_fields = ["id", "student", "created_at"]


class InterviewSerializer(serializers.ModelSerializer):
    job_detail = serializers.SerializerMethodField()
    company_name = serializers.CharField(source="company.company_name", read_only=True)
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
            "job_detail",
            "company_name",
        ]
        read_only_fields = ["id", "student", "company", "created_at", "updated_at", "job_detail", "company_name"]

    def get_job_detail(self, obj):
        return {"id": obj.job_id, "title": obj.job.title, "company": obj.company.company_name}


class JobApplicationSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.filter(is_active=True))
    student = serializers.PrimaryKeyRelatedField(read_only=True)
    job_detail = serializers.SerializerMethodField()

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
            "job_detail",
        ]
        read_only_fields = ["id", "student", "status", "applied_at", "updated_at", "job_detail"]

    def get_job_detail(self, obj):
        return {"id": obj.job_id, "title": obj.job.title, "company": obj.job.company.company_name, "location": obj.job.location}

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not hasattr(request, "user"):
            raise serializers.ValidationError("Request context is required.")

        student = request.user.profile
        if student.role != UserRole.STUDENT:
            raise serializers.ValidationError("Only student users can apply for jobs.")

        job = attrs.get("job")
        student_profile = StudentProfile.objects.filter(user=request.user).first()
        if not student_profile:
            raise serializers.ValidationError("Complete your student profile before applying for jobs.")

        if job and not job.is_eligible_for(student_profile):
            raise serializers.ValidationError("You are not eligible for this job.")

        from django.utils import timezone
        if job and job.application_deadline and job.application_deadline <= timezone.now():
            raise serializers.ValidationError("The application deadline has passed.")

        if JobApplication.objects.filter(student=student_profile, job=job).exists():
            raise serializers.ValidationError("You have already applied for this job.")

        return attrs

