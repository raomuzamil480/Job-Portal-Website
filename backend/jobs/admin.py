from django.contrib import admin
from .models import Profile, Category, Job, Application


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'company_name', 'location']
    list_filter = ['role']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'job_type', 'status', 'created_at']
    list_filter = ['status', 'job_type', 'experience', 'category']
    search_fields = ['title', 'company']
    list_editable = ['status']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status', 'applied_at']
    list_filter = ['status']
    list_editable = ['status']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
