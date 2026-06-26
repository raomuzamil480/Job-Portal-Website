from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    ROLE_CHOICES = [('employer', 'Employer'), ('seeker', 'Job Seeker')]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    company_name = models.CharField(max_length=255, blank=True, help_text='For employers only')
    company_website = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Comma separated skills')
    location = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.user.username} ({self.role})'


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Job(models.Model):
    TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('remote', 'Remote'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
    ]
    STATUS_CHOICES = [('open', 'Open'), ('closed', 'Closed')]
    EXPERIENCE_CHOICES = [
        ('entry', 'Entry Level (0-1 years)'),
        ('junior', 'Junior (1-3 years)'),
        ('mid', 'Mid Level (3-5 years)'),
        ('senior', 'Senior (5+ years)'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs')
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    location = models.CharField(max_length=150)
    job_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full-time')
    experience = models.CharField(max_length=10, choices=EXPERIENCE_CHOICES, default='entry')
    salary_min = models.PositiveIntegerField(null=True, blank=True)
    salary_max = models.PositiveIntegerField(null=True, blank=True)
    description = models.TextField()
    requirements = models.TextField(blank=True)
    skills_required = models.TextField(blank=True, help_text='Comma separated')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} at {self.company}'

    @property
    def applications_count(self):
        return self.applications.count()

    @property
    def salary_display(self):
        if self.salary_min and self.salary_max:
            return f'${self.salary_min:,} - ${self.salary_max:,}'
        elif self.salary_min:
            return f'From ${self.salary_min:,}'
        return 'Negotiable'


class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('reviewing', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('offered', 'Offer Extended'),
        ('rejected', 'Rejected'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField()
    resume_link = models.URLField(blank=True, help_text='Link to your resume (Google Drive, LinkedIn, etc.)')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        unique_together = ['job', 'applicant']

    def __str__(self):
        return f'{self.applicant.username} → {self.job.title}'
