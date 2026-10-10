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
    profile = UserProfileSerializer(read_only=True)

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
        ]
        read_only_fields = ["id", "student", "company", "created_at", "updated_at"]


class JobApplicationSerializer(serializers.ModelSerializer):
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())
    student = serializers.PrimaryKeyRelatedField(read_only=True)

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
        read_only_fields = ["id", "student", "applied_at", "updated_at"]

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

        if JobApplication.objects.filter(student=student_profile, job=job).exists():
            raise serializers.ValidationError("You have already applied for this job.")

        return attrs

