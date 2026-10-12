from django.contrib.auth.models import User
from django.db import models


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="student_profile")
    full_name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, blank=True, default="")
    year_of_study = models.IntegerField(default=1)
    graduation_year = models.IntegerField(default=2027)
    cgpa = models.FloatField(null=True, blank=True)
    bio = models.TextField(blank=True, default="")
    city = models.CharField(max_length=255, blank=True, default="")
    address = models.TextField(blank=True, default="")
    portfolio_url = models.URLField(blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")
    github_url = models.URLField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.full_name or self.user.username


class Education(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="education")
    institution_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    field_of_study = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=50, blank=True, default="")
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-end_date", "-created_at"]

    def __str__(self):
        return f"{self.student.full_name} - {self.degree}"


class Skill(models.Model):
    SKILL_LEVEL_CHOICES = [
        ("BEGINNER", "Beginner"),
        ("INTERMEDIATE", "Intermediate"),
        ("ADVANCED", "Advanced"),
        ("EXPERT", "Expert"),
    ]

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="skills")
    name = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=SKILL_LEVEL_CHOICES, default="BEGINNER")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("student", "name")
        ordering = ["name"]

    def __str__(self):
        return f"{self.student.full_name} - {self.name}"


class Resume(models.Model):
    student = models.OneToOneField(StudentProfile, on_delete=models.CASCADE, related_name="resume")
    file = models.FileField(upload_to="resumes/%Y/%m/%d/")
    file_name = models.CharField(max_length=255, blank=True, default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.student.full_name} - Resume"


class Notification(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.full_name} - {self.title}"


class Interview(models.Model):
    class InterviewStatus(models.TextChoices):
        SCHEDULED = "SCHEDULED", "Scheduled"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    student = models.ForeignKey("students.StudentProfile", on_delete=models.CASCADE, related_name="interviews")
    application = models.ForeignKey("jobs.JobApplication", on_delete=models.CASCADE, related_name="interviews", null=True, blank=True)
    job = models.ForeignKey("jobs.Job", on_delete=models.CASCADE, related_name="interviews")
    company = models.ForeignKey("companies.CompanyProfile", on_delete=models.CASCADE, related_name="company_interviews")
    interview_round = models.CharField(max_length=100, blank=True, default="")
    scheduled_at = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, default="")
    meeting_link = models.URLField(blank=True, default="")
    mode = models.CharField(max_length=20, choices=[("ONLINE", "Online"), ("ONSITE", "On-site")], default="ONLINE")
    notes = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=InterviewStatus.choices, default=InterviewStatus.SCHEDULED)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-scheduled_at"]

    def __str__(self):
        return f"{self.student.full_name} - {self.company.company_name} - {self.status}"
