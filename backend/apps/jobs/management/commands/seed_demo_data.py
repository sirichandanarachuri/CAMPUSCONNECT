from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from apps.accounts.models import UserProfile, UserRole
from apps.companies.models import CompanyProfile
from apps.students.models import StudentProfile
from apps.jobs.models import Job, JobApplication
from apps.students.models import Interview
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Populate database with sample/demo data (duplicate-safe)'

    def handle(self, *args, **options):
        # Create or get companies
        companies_data = [
            {
                'name': 'TechCorp India',
                'industry': 'Information Technology',
                'website': 'https://techcorp.example.com',
                'location': 'Bangalore',
                'description': 'Leading IT solutions provider',
            },
            {
                'name': 'DataSync Solutions',
                'industry': 'Data Analytics',
                'website': 'https://datasync.example.com',
                'location': 'Mumbai',
                'description': 'Enterprise data management platform',
            },
            {
                'name': 'CloudNine Systems',
                'industry': 'Cloud Computing',
                'website': 'https://cloudnine.example.com',
                'location': 'Pune',
                'description': 'Cloud infrastructure and services',
            },
            {
                'name': 'FinTech Innovations',
                'industry': 'Financial Technology',
                'website': 'https://fintech.example.com',
                'location': 'Delhi',
                'description': 'Fintech solutions for banking',
            },
            {
                'name': 'AI Research Labs',
                'industry': 'Artificial Intelligence',
                'website': 'https://airesearch.example.com',
                'location': 'Hyderabad',
                'description': 'Cutting-edge AI and ML research',
            },
        ]

        companies = {}
        for comp_data in companies_data:
            user, _ = User.objects.get_or_create(
                username=comp_data['name'].lower().replace(' ', '_'),
                defaults={
                    'email': f"{comp_data['name'].lower().replace(' ', '.')}@company.com",
                    'first_name': comp_data['name'].split()[0],
                }
            )
            company, created = CompanyProfile.objects.get_or_create(
                user=user,
                defaults={
                    'company_name': comp_data['name'],
                    'industry': comp_data['industry'],
                    'website': comp_data['website'],
                    'location': comp_data['location'],
                    'description': comp_data['description'],
                    'company_email': f"hr@{comp_data['name'].lower().replace(' ', '')}.com",
                    'contact_person': 'HR Department',
                    'phone_number': '+91-9876543210',
                }
            )
            # Update profile if company exists
            if not created:
                company.company_name = comp_data['name']
                company.industry = comp_data['industry']
                company.website = comp_data['website']
                company.location = comp_data['location']
                company.description = comp_data['description']
                company.save()
            companies[comp_data['name']] = company
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created company: {comp_data["name"]}'))
            else:
                self.stdout.write(f'✓ Company already exists: {comp_data["name"]}')

        # Create jobs
        jobs_data = [
            {
                'company_name': 'TechCorp India',
                'title': 'Senior Software Engineer',
                'description': 'We are looking for an experienced software engineer with 3+ years of experience in backend development using Python and Django.',
                'location': 'Bangalore',
                'salary': '12-15 LPA',
                'job_type': Job.JobType.FULL_TIME,
                'min_cgpa': 6.5,
                'min_year': 3,
                'max_year': 5,
                'department': 'Computer Science',
            },
            {
                'company_name': 'TechCorp India',
                'title': 'Full Stack Developer',
                'description': 'Build modern web applications using React and Node.js. Join our growing team and work on exciting projects.',
                'location': 'Bangalore',
                'salary': '10-12 LPA',
                'job_type': Job.JobType.FULL_TIME,
                'min_cgpa': 6.0,
                'min_year': 2,
                'max_year': 4,
                'department': '',
            },
            {
                'company_name': 'DataSync Solutions',
                'title': 'Data Analyst Internship',
                'description': 'Work on real-world data analytics projects using Python, SQL, and Tableau. Great learning opportunity for students.',
                'location': 'Mumbai',
                'salary': '3-5 LPA',
                'job_type': Job.JobType.INTERNSHIP,
                'min_cgpa': 7.0,
                'min_year': 2,
                'max_year': 3,
                'department': 'Computer Science',
            },
            {
                'company_name': 'CloudNine Systems',
                'title': 'DevOps Engineer',
                'description': 'Manage cloud infrastructure on AWS/Azure. Experience with Docker, Kubernetes, and CI/CD pipelines required.',
                'location': 'Pune',
                'salary': '11-14 LPA',
                'job_type': Job.JobType.FULL_TIME,
                'min_cgpa': 6.5,
                'min_year': 2,
                'max_year': 5,
                'department': 'Computer Science',
            },
            {
                'company_name': 'FinTech Innovations',
                'title': 'Java Developer',
                'description': 'Develop robust banking solutions using Java Spring Boot. Security and performance are critical.',
                'location': 'Delhi',
                'salary': '10-13 LPA',
                'job_type': Job.JobType.FULL_TIME,
                'min_cgpa': 6.8,
                'min_year': 2,
                'max_year': 4,
                'department': '',
            },
            {
                'company_name': 'AI Research Labs',
                'title': 'Machine Learning Engineer',
                'description': 'Work on cutting-edge ML models and research. Python, TensorFlow, and PyTorch experience essential.',
                'location': 'Hyderabad',
                'salary': '13-16 LPA',
                'job_type': Job.JobType.FULL_TIME,
                'min_cgpa': 7.5,
                'min_year': 3,
                'max_year': 5,
                'department': 'Computer Science',
            },
        ]

        jobs = []
        for job_data in jobs_data:
            company = companies[job_data['company_name']]
            job, created = Job.objects.get_or_create(
                company=company,
                title=job_data['title'],
                defaults={
                    'description': job_data['description'],
                    'location': job_data['location'],
                    'salary': job_data['salary'],
                    'job_type': job_data['job_type'],
                    'min_cgpa': job_data['min_cgpa'],
                    'min_year': job_data['min_year'],
                    'max_year': job_data['max_year'],
                    'department': job_data['department'],
                    'is_active': True,
                }
            )
            # Update job if exists
            if not created:
                job.description = job_data['description']
                job.location = job_data['location']
                job.salary = job_data['salary']
                job.job_type = job_data['job_type']
                job.min_cgpa = job_data['min_cgpa']
                job.min_year = job_data['min_year']
                job.max_year = job_data['max_year']
                job.department = job_data['department']
                job.save()
            jobs.append(job)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Created job: {job_data["title"]} @ {job_data["company_name"]}'))
            else:
                self.stdout.write(f'✓ Job already exists: {job_data["title"]} @ {job_data["company_name"]}')

        # Update existing student profiles to be eligible for jobs
        self.stdout.write('\n--- Updating Student Profiles ---')
        students = StudentProfile.objects.all()
        for student in students:
            if not student.cgpa or student.cgpa == 0:
                student.cgpa = 7.5
                student.year_of_study = 3
                student.department = 'Computer Science'
                student.save()
                self.stdout.write(f'✓ Updated student: {student.user.username}')

        # Create sample applications (if student profiles exist)
        self.stdout.write('\n--- Creating Sample Applications ---')
        for student in StudentProfile.objects.all()[:2]:  # Only for first 2 students
            for job in jobs[:3]:  # First 3 jobs
                if job.is_eligible_for(student):
                    app, created = JobApplication.objects.get_or_create(
                        student=student,
                        job=job,
                        defaults={
                            'status': JobApplication.ApplicationStatus.APPLIED,
                            'cover_letter': f'I am interested in the {job.title} position at {job.company.company_name}.',
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'✓ Created application: {student.user.username} -> {job.title}'))
                    else:
                        self.stdout.write(f'✓ Application already exists: {student.user.username} -> {job.title}')

        # Create sample interviews
        self.stdout.write('\n--- Creating Sample Interviews ---')
        for student in StudentProfile.objects.all()[:2]:
            for job in jobs[:2]:
                if job.is_eligible_for(student):
                    interview, created = Interview.objects.get_or_create(
                        student=student,
                        job=job,
                        defaults={
                            'company': job.company,
                            'interview_round': 'Technical Round 1',
                            'scheduled_at': timezone.now() + timedelta(days=7),
                            'location': job.company.location,
                            'status': Interview.InterviewStatus.SCHEDULED,
                            'notes': f'Interview for {job.title} position',
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'✓ Created interview: {student.user.username} -> {job.company.company_name}'))
                    else:
                        self.stdout.write(f'✓ Interview already exists: {student.user.username} -> {job.company.company_name}')

        self.stdout.write(self.style.SUCCESS('\n✓ Demo data seeding completed successfully!'))


