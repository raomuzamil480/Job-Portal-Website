from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Profile, Category, Job, Application
from .serializers import (
    RegisterSerializer, ProfileSerializer,
    CategorySerializer, JobSerializer, ApplicationSerializer
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'message': 'Account created successfully!'}, status=201)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'company', 'location', 'skills_required', 'description']

    def get_queryset(self):
        queryset = Job.objects.select_related('employer', 'category').all()

        category = self.request.query_params.get('category')
        job_type = self.request.query_params.get('job_type')
        experience = self.request.query_params.get('experience')
        location = self.request.query_params.get('location')
        status_filter = self.request.query_params.get('status', 'open')

        if category:
            queryset = queryset.filter(category__slug=category)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if experience:
            queryset = queryset.filter(experience=experience)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset

    def get_serializer_context(self):
        return {'request': self.request}
    

    def perform_create(self, serializer):
        try:
            profile = self.request.user.profile
            if profile.role != 'employer':
                raise permissions.PermissionDenied("Only employers can post jobs.")
        except Profile.DoesNotExist:
            raise permissions.PermissionDenied("Profile not found.")
        serializer.save(employer=self.request.user, company=profile.company_name or self.request.user.username)

    def destroy(self, request, *args, **kwargs):
        job = self.get_object()
        if job.employer != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        job = self.get_object()
        if job.employer != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_jobs(self, request):
        """Employer ke apne posted jobs"""
        jobs = Job.objects.filter(employer=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk=None):
        """Job seeker apply kare yes"""
        job = self.get_object()

        try:
            profile = request.user.profile
            if profile.role != 'seeker':
                return Response({'error': 'Only job seekers can apply.'}, status=400)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=400)

        if job.status != 'open':
            return Response({'error': 'This job is no longer accepting applications.'}, status=400)

        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response({'error': 'You have already applied to this job.'}, status=400)

        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job, applicant=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def applications(self, request, pk=None):
        """Employer apni job ke applications dekhe"""
        job = self.get_object()
        if job.employer != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        apps = job.applications.select_related('applicant').all()
        serializer = ApplicationSerializer(apps, many=True)
        return Response(serializer.data)


class MyApplicationsView(generics.ListAPIView):
    """Job seeker ki apni sab applications"""
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user).select_related('job')


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_application_status(request, pk):
    """Employer application ka status update kare"""
    try:
        app = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=404)

    if app.job.employer != request.user:
        return Response({'error': 'Not authorized'}, status=403)

    new_status = request.data.get('status')
    valid_statuses = [s[0] for s in Application.STATUS_CHOICES]
    if new_status not in valid_statuses:
        return Response({'error': 'Invalid status'}, status=400)

    app.status = new_status
    app.save()
    return Response(ApplicationSerializer(app).data)
