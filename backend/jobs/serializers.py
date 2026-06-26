from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.text import slugify
from .models import Profile, Category, Job, Application


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=['employer', 'seeker'])
    company_name = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        role = validated_data.pop('role')
        company_name = validated_data.pop('company_name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Profile.objects.create(user=user, role=role, company_name=company_name)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'role', 'company_name', 'company_website', 'bio', 'skills', 'location', 'phone']


class CategorySerializer(serializers.ModelSerializer):
    jobs_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'jobs_count']

    def get_jobs_count(self, obj):
        return obj.jobs.filter(status='open').count()


class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.username', read_only=True)
    employer_company = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    applications_count = serializers.ReadOnlyField()
    salary_display = serializers.ReadOnlyField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'employer_name', 'employer_company', 'category', 'category_id',
            'title', 'company', 'location', 'job_type', 'experience',
            'salary_min', 'salary_max', 'salary_display',
            'description', 'requirements', 'skills_required',
            'status', 'deadline', 'applications_count', 'has_applied', 'created_at'
        ]
        read_only_fields = ['id', 'employer_name', 'created_at']

    def get_employer_company(self, obj):
        try:
            return obj.employer.profile.company_name
        except:
            return ''

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(applicant=request.user).exists()
        return False


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.username', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_company = serializers.CharField(source='job.company', read_only=True)
    job_id = serializers.IntegerField(source='job.id', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job_id', 'job_title', 'job_company',
            'applicant_name', 'applicant_email',
            'cover_letter', 'resume_link', 'status',
            'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'applied_at', 'updated_at']
