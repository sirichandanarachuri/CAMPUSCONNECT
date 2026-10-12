from django.db import models
from django.utils import timezone

from apps.companies.models import CompanyProfile
from apps.students.models import StudentProfile


class Job(models.Model):
    class JobType(models.TextChoices):
        FULL_TIME = "FULL_TIME", "Full Time"
        INTERNSHIP = "INTERNSHIP", "Internship"
        PART_TIME = "PART_TIME", "Part Time"
        CONTRACT = "CONTRACT", "Contract"

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    salary = models.CharField(max_length=200, blank=True, default="")
    job_type = models.CharField(max_length=20, choices=JobType.choices, default=JobType.FULL_TIME)
    eligibility_criteria = models.TextField(blank=True, default="")
    min_cgpa = models.FloatField(default=0.0)
    min_year = models.IntegerField(default=1)
    max_year = models.IntegerField(default=5)
    department = models.CharField(max_length=200, blank=True, default="")
    application_deadline = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} @ {self.company.company_name}"

    def is_eligible_for(self, student_profile):
        if student_profile.cgpa is None:
            return False
        if student_profile.cgpa < self.min_cgpa:
            return False
        if student_profile.year_of_study < self.min_year:
            return False
        if student_profile.year_of_study > self.max_year:
            return False
        departments = [department.strip().casefold() for department in self.department.split(",") if department.strip()]
        if departments and student_profile.department.strip().casefold() not in departments:
            return False
        if self.application_deadline and self.application_deadline <= timezone.now():
            return False
        return True


class JobApplication(models.Model):
    class ApplicationStatus(models.TextChoices):
        APPLIED = "APPLIED", "Applied"
        SHORTLISTED = "SHORTLISTED", "Shortlisted"
        INTERVIEW = "INTERVIEW", "Interview"
        REJECTED = "REJECTED", "Rejected"
        SELECTED = "SELECTED", "Selected"

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name="applications")
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
    )
    cover_letter = models.TextField(blank=True, default="")
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("student", "job")
        ordering = ["-applied_at"]

    def __str__(self):
        return f"{self.student.user.username} -> {self.job.title} ({self.status})"

